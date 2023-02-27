# ${{values.repo_name}}

${{values.description}}


## To finish repo preparation:
If you meet any troubles – ask in `#contact-fe-infra` slack channel 

* create new project in cypress dashboard (it's accessible via okta, to get access send request to IT)
* put projectId into `cypress.json`
* Follow [these steps](https://jira.yotpo.com/wiki/display/RD/Kubernetes+-+New+service+on-boarding#heading-VaultSecrets-2) to create in secrets folder in vault. Select there product line: `${{values.product_line }}` and service name: `${{values.project_name }}`. Then manually put there `PASSWORD`, `USERNAME` for logging in into product and `RECORD_KEY` from cypress dashboard. Path to secrets is specified in `deployments/configuration/config.yaml`
* Run [this scaffolder](https://yotpo.roadie.so/create/templates/default/github-actions-permissions) to add AWS permissions to this repo
* Ask in `#contact-fe-infra` to connect your slack channel for cypress dashboard alerts
* Open `cypress/integration/sanity.spec.ts` to write your first test
* To run tests locally follow instructions below
* To run tests in k8s – push your branch, wait for image to be built in github actions and trigger deployment in [jenkins](https://jenkins.yotpo.com/job/production_deploy_${{values.project_name}}_to_k8s/) 
* When repo is set and you can run the simplest test, remove this block
* You are awesome



## To run tests locally
* run `npm install`
* create in the root of the project `.env` file with content like:
```bash
USERNAME=<username>
PASSWORD=<password>
RECORD_KEY=<cypress dashboard record key>
```
* run `npm run open:prod`

## To run tests on CI
[Documentation on Backstage](https://yotpo.roadie.so/docs/default/domain/frontend-infra/cypress-e2e/)
