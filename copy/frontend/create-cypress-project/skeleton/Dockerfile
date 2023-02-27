FROM cypress/included:9.4.1
ARG JFROG_USER=local
ARG JFROG_PASSWORD=local
ARG RUN_TAG=local
WORKDIR /e2e
RUN apt install curl

COPY .npmrc /e2e/
RUN curl -u ${JFROG_USER}:${JFROG_PASSWORD} https://yotpo.jfrog.io/yotpo/api/npm/npm-vrt/auth/yotpo-ui >> .npmrc

COPY package*.json /e2e/
RUN npm i --only-dev

COPY . /e2e/

ENTRYPOINT npm run test:prod:record -- --tag='${CYPRESS_RUN_TAG}'
