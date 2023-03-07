#!/usr/bin/env bash
set -e
echo "Starting deployment...."

if [[ -e '.env.local' ]]; then
  export $(grep -v '^#' .env.local | xargs)
fi

S3_BUCKET=yotpo-production
PROJECT=$(npx -c 'echo $npm_package_name')
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ $GIT_BRANCH == "master" ]]; then
  echo "Error! Cannot run script from master branch"
  exit -1
fi

export PUBLIC_PATH="https://cdn-widget-assets.yotpo.com/${PROJECT}/custom/"
npm run build

echo "Branch is not master: $GIT_BRANCH, preparing temporary version"
current_version=$(npx -c 'echo $npm_package_version')
temp_version="${current_version}-${USER}"
custom_version_file="app.v${temp_version}.js"
echo "version to publish: ${temp_version}"

rm -rf ./s3_dist
mkdir -p ./s3_dist
file_name="./s3_dist/${custom_version_file}"

if [[ $WEBPACK_SPLIT_CHUNKS ]]; then
  cp ./dist/js/app.*.js "${file_name}"
  mkdir -p ./s3_dist/js
  cp ./dist/js/app-*.*.js ./s3_dist/js
else
  cp ./dist/js/app.js "${file_name}"
fi

if [[ -e "./dist/js/app.js.map" ]]; then
  cp ./dist/js/app.js.map "${file_name}.map"
  echo "Replacing source map url: sourceMappingURL=app.js.map to sourceMappingURL=${custom_version_file}.map ${file_name}"
  sed -i -e "s/sourceMappingURL=(app\.*).js/sourceMappingURL=$1.js/g" "${file_name}"
  sed -i -e "s/sourceMappingURL=(app-.*\.*).js/sourceMappingURL=$1.js/g" "${file_name}"
fi

s3_path="s3://${S3_BUCKET}/widget-assets/${PROJECT}/custom"

echo "Upload bundle to s3 folder ${s3_path}"
aws s3 cp "${file_name}" "${s3_path}/${custom_version_file}" --acl public-read --content-type "application/javascript" --cache-control "max-age=31536000"

if [[ $WEBPACK_SPLIT_CHUNKS ]]; then
  aws s3 cp "./s3_dist/js" "${s3_path}/js/" --recursive --acl public-read --content-type "application/javascript" --cache-control "max-age=31536000"
fi

if [[ -e "./dist/js/app.js.map" ]]; then
  echo "Upload sourcemap to s3 folder ${s3_path}"
  aws s3 cp "${file_name}.map" "${s3_path}/${custom_version_file}.map" --acl public-read --content-type "application/javascript" --cache-control "max-age=31536000"
fi

echo "Bundle uploaded, to use the custom version, use the following URL:"
echo "${PUBLIC_PATH}${custom_version_file}"

if [[ $YOTPO_APP_KEY && $WIDGET_INSTANCE_ID ]]; then
  curl -o /dev/null -w 'Got HTTP %{http_code} \n' --location --request PUT "https://widgetsrepository-service-default.yotpo.xyz/v1/${YOTPO_APP_KEY}/widget_instances/${WIDGET_INSTANCE_ID}" \
    --header 'Content-Type: application/json' \
    --data-raw "{
        \"partial_update\": true,
        \"instance\": {
            \"widget_instance_id\": ${WIDGET_INSTANCE_ID},
            \"template_asset_url\": \"${PUBLIC_PATH}/${custom_version_file}\"
        }
    }"
fi

exit 0
