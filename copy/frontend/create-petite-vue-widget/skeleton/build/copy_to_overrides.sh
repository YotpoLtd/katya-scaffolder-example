#!/bin/bash

project_name=$(npx -c 'echo $npm_package_name')
overrides_folder="${HOME}/overrides/cdn-widget-assets.yotpo.com/${project_name}"

working_dir=$(pwd)

latest_widget="$(find ${overrides_folder} -type f -maxdepth 3 -name '*.js' | xargs ls -At | head -n 1)"

if [[ -e "dist/js/app.js" ]]; then
  echo 'No split chunks detected - copying app.js file'
  cp "${working_dir}/dist/js/app.js" "${latest_widget}"
else
  latest_app_js="$(ls -At ${working_dir}/dist/js/app.*.js | head -n 1)"
  echo "Split chunks detected - clearing ${overrides_folder}/js"
  rm -r "${overrides_folder}/js/"
  mkdir -p "${overrides_folder}/js"
  echo "Copying: ${latest_app_js}"
  cp "${latest_app_js}" "${latest_widget}"
  echo 'Copying chunk files'
  cp -R "${working_dir}/dist/js" "${overrides_folder}/"
fi

echo 'Copied:'
echo "$(ls -lRt $overrides_folder)"
