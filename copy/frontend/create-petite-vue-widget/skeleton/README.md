# ${{values.widgetName}}
 
# ${{values.widget-ame}}

# ${{values.repo_name}}

# put APPLITOOLS_API_KEY into env and secrets 


# ${{values.repo_name}}

[![CI](https://github.com/YotpoLtd/widget-promoted-products/actions/workflows/build.yaml/badge.svg?branch=master)](https://github.com/YotpoLtd/widget-promoted-products/actions/workflows/build.yaml)

## Project setup

`npm install`

If you encounter 401 error from JFrog:

```
npm config set registry https://yotpo.jfrog.io/yotpo/api/npm/npm-vrt/
npm login // use your JFrog username and API key (if it doesn't work refresh the API key and use the new one)
```

### Compiles and hot-reloads for development

`npm run serve`

### Compiles and minifies for production

`npm run build`

### Run your unit tests

`npm run test:unit`

### Run your end-to-end tests

`npm run test:e2e:cypress:run:local`

### Run visual regression tests

```
npm run test:e2e (with Cypress GUI)
npm run test:e2e:visual-regression (headless)
```

- Cypress will run the tests in the tests/e2e/specs/ui/visual-regression
- the output diff images are saved in tests/e2e/snapshots/visual-regression.spec.ts

### Lints and fixes files

`npm run lint`

### Check local customization in production environment

1. visit widget editor
2. open dev console
3. enter following commands:
   var schema = {YOUR_LOCAL_SCHEMA_FROM_CUSTOMIZATION_SCHEMA}
   sessionStorage.setItem('${{ values.widgetName }}_schema_override', JSON.stringify(schema))

### Check js-build in production environment

1. Enable local overrides (Developer Tools -> Sources -> Enable Local Overrides)
2. In the sources panel, create a new folder called js-overrides (best inside Development folder not inside the project folder)
3. Refresh and locate the relevant app.js under Network (the one sent from widget-promoted-products), right click and select Save for overrides
4. In the root folder of your module project, run npm run build:chrome

### Check widget version in production environment

1. Create a `.env.local` file with the environment variables:

```
YOTPO_APP_KEY=<<YOUR_APP_KEY>>
WIDGET_INSTANCE_ID=<<YOUR_INSTANCE_ID>>
```

2. Regenerate AWS credentials with `yotpo awsa developer production` (See [ops-helpers](https://github.com/YotpoLtd/ops-helpers#how-to-get-aws-credentials))
3. Run `./build/deploy_custom_version.sh`
4. The script will deploy the bundled version to the custom folder in S3.

- **Update version in package.json between deploys to make sure it's not cached by the CDN**

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
