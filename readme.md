# App Template

Basic web-app template. By default it's assumed, that it would be a web-app with at least HTTP API.
if other service is needed (sockets, for example), the conceived way is to add `source/service.ts` and `source/service/`; then, add the corresponding npm script to `package.json` and there you go

## Local dev deploy

### Pre-requisites

- Unix-like OS (Linux tested 100%; MacOS isn't tested at all)
- [Node Version Manager](https://github.com/nvm-sh/nvm)
- [Docker](https://docs.docker.com/engine/install/)

### Deploy

1. Rename the folder (otherwise, docker-compose network name would be confusing)
1. Update Node.js version
    - put the required node version into `.nvmrc` file
    - `nvm use`
1. Update packages versions
    - `npm run update-packages`
    - `npm install`
        >If something goes wrong, read the log & manually rollback the package(s) version. Sometimes it happens for reasons beyond me (`npm-check-updates` package just updates the `package.json`)
1. Update Docker-images versions & names
    - `docker-compose.dev.yml`:
        - services/service-name: image, container_name, volumes
        - volumes/volume-name: name
        - services/postgres/environment: POSTGRES_DB
1. Run docker-compose
    - `npm run compose:up`
        >`:down` for removing containers with their volumes; `:stop` & `:start` for pausing & starting the containers, respectively
1. Update config values
    - `config/default.ts`
1. Run the API in dev-mode
    - `npm run api:dev`

### Optional

- `npx husky init`, if you want to use git-hooks. Links: [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks), [Husky](https://typicode.github.io/husky/)

## Database

- `npm run migrate:new` for creating new migration-file
- `npm run migrate` for migrating existing files

- `npm run psql` for direct aceess (update `package.json` script first: `template-postgres` is your `container_name`, and `template` is your `POSTGRES_DB`)
