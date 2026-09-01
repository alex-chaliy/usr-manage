# Common Instructions for the Entire Project

Common instuctions for all of the applications and services
────────────────────────────────────────

# Attention

The whole folders/monorepos structure and infrastructure is not yet implemented,
currently we work on Admin App ('usr-manage') that later will be placed into sub-repo `jobbify-io-admin`.
This section (Attention) will be removed after the whole structure will be implemented.
────────────────────────────────────────


# APP INFO

App name: Jobbify IO
App Description: Jobbify IO - app for job search, the main goal of which is to connect talent searchers and specialists
Repo name: jobbify-io
Structure: Microservices, Monorepo
Stack: Angular, Node.js, NestJS, MongoDB, Prisma ORM, REST API
Infrastructure Stack: NgInx, Docker, RabbitMQ, Redis (for rate limiting)

────────────────────────────────────────

# ENV NAMES (Environments)

local, development, testing, staging, production

────────────────────────────────────────

# ENTITIES (Collection Names)

Users, Positions, Technologies, Levels, EmploymentTypes

────────────────────────────────────────

# MICROSERVICES AND API ROUTES

microservice-names: user-service, position-service, technology-service, level-service, employment-type-service

microservice-route means api-route

api-routes (microservice-routes): users, positions, technologies, levels, employment-types

api route naming: entity (collection name) -> microservice-name -> api-route

e.g.:

Users -> user-service -> /users

EmploymentTypes -> employment-type-service -> /employment-types

────────────────────────────────────────

# APPS (structure to implement later)

## Admin app
- sub-repo: jobbify-io-admin
- sub-domain / app-name: admin.
- description: web application for managing the main app users, content etc.
- tech: Angular

## Web App
- **sub-repo:** jobbify-io-webapp
- **sub-domain / app-name:** app.
- **description:** the main app for the web.
- **tech:** Angular

## Landing page
sub-repo: jobbify-io-landing
sub-domain / app-name: NO, because it is the app enter
description: landing page, the main goal of which is to show a user the app advantages, why choose our application, and provide ability to Sign In or Sign Up.
Ability to Sign In or Sign Up — 2 links in the header layout, and also 'Sign Up' link as action on the first screen of the landing page.
When clicking 'Sign In' or 'Sign Up', a user will be redirected to the Web App with routes /sign-in or /sign-up accordingly (https://app.site-name.com/sign-in or https://app.site-name.com/sign-up)
tech: init with Angular, but it can be switched to Next.js, 'cos we need SSR,
before start development make research, maybe Next.js is much better solution to quickly build a landing page SSR (server side rendering)

## API
sub-repo: a separate sub-repo for each api-service. all api-services must be inside services/ folder.
sub-domain / app-name: api.
microservice sub-repo naming: <service-name>-service. e.g.:

- user-service/
- employment-type-service/
  description: a list of microservices that act as the same API.
  tech: Node.js, NestJS, MongoDB, Prisma ORM, SWC (Speedy Web Compiler), Dockerfile

## CDN
sub-repo: jobbify-io-cdn
sub-domain / app-name: cdn.
description: a separate microservice (container) that is a wrapper above AWS S3, and also it manages all of the files storing, size limiting etc., AWS S3 to store files.
tech: Node.js, NestJS, SWC, Dockerfile

────────────────────────────────────────

# INFRASTRUCTURE

## SETUP

1. Every web application or microservice is wrapped with a Docker container and has its own Dockerfile.
2. Use Docker Compose to manage Docker Containers.
3. All of the LINKS are managed by Nginx and Nginx config.
4. Every Environment runs on a separate machine and has its own Nginx config and .env file.
5. The real .env file is used by Docker or Docker Compose and
   it must NEVER appear in the git-repository.
6. Any real api-keys and other sensitive data must NEVER appear on the git-repository.
7. Instead of this, when we need to set up an environment, we
  copy the needed file from sample files and fill it manually.
  How to do it:

  - you've just cloned the project-repo and need to setup it;
  - copy needed file from /samples folder and paste it to needed place
  - where to paste files: paste root.env to the project's root folder, <microservice-name>.env to needed microservice's folder.
  - Dockerfile and compose.yaml file are already set up.
  - Nginx config setup is provided below.
  - remove 'sample' and '<env-name>' filename,
    e.g. FILES:
    - root.sample-staging.env -> root.env
    - ai-service.sampe-local.env -> ai-service.env
    - user-service.sampe-testing.env -> user-service.env
    - Dockerfile.sample -> Dockerfile (Dockerfile is the same on all environments)
    - compose.sample.yaml -> compose.yaml (compose.yaml is the same on all environments)
    - nginx.sampe-local.conf -> nginx.conf

## RATE LIMITING
Use Redis for rate limiting:
- 5 RPS (requests per second) for api requests
- 300 RPM (requests per minute) for fetching frontend builds and media-files

## SAMPLE FILES
/samples/env/root.sample-<env-name>.yaml (see ENV NAMES section)
/samples/env/<microservice-name>.sample-<env-name>.yaml (see microservice-names section)
/samples/dockerfile/Dockerfile.sample
/samples/compose/compose.sample.yaml
/samples/nginx/nginx.sample.conf


## NGINX SETUP

- Where to store Nginx config
- How to setup Nginx and nginx.conf

Here you can find the answers:

- https://ubuntu.com/server/docs/how-to/web-services/configure-nginx/#multi-site-hosting
- https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04
- https://nginx.org/en/docs/beginners_guide.html

or just ask Gemini or Claude (for humans only):
- Where to store Nginx config?
- sites-available and sites-enabled difference?

────────────────────────────────────────

# LINKS

Rules for both — Frontend and Backend Links

**rule**: see `<env-name>`, `<app-name>`, `<api-route>` variable values in sections **"ENV NAMES"**, **"sub-domain / app-name"**, **"api-routes (microservice-routes)"** accordingly.

**rule**: `<domain>` = site-name.com or **jobbify-io.local**

**rule**: production link must **not** contain `<env-name>`

## FRONTEND Links

### Frontend links pattern

`<env-name> - <app-name> . <domain>`

### Admin app links ("jobbify-io-admin" Angular app)

- **local:** admin.jobbify-io.local
- **development:** development-admin.site-name.com
- **testing:** testing-admin.site-name.com
- **staging:** staging-admin.site-name.com
- **production:** admin.site-name.com

### Landing page links ("jobbify-io-landing" app)

- **local:** jobbify-io.local
- **development:** development.site-name.com
- **testing:** testing.site-name.com
- **staging:** staging.site-name.com
- **production:** site-name.com

### Web app links ("jobbify-io-webapp" Angular app)

- **local:** app.jobbify-io.local
- **development:** development-app.site-name.com
- **testing:** testing-app.site-name.com
- **staging:** staging-app.site-name.com
- **production:** app.site-name.com

────────────────────────────────────────

## BACKEND Links

### BACKEND links pattern

For every api-route we have a separate microservice (docker container)

**Pattern:**
`<env-name> - <app-name> . <domain> / <version> / <api-route>`

e.g. `<domain>` = site-name.com
e.g. `<version>` = v1

**Latest API Version:** v1

### API links

- local: api.jobbify-io.local/<version>/<microservice-route>
- development: development-api.site-name.com/<version>/<microservice-route>
- testing: testing-api.site-name.com/<version>/<microservice-route>
- staging: staging-api.site-name.com/<version>/<microservice-route>
- production: api.site-name.com/<version>/<microservice-route>

  e.g.:

- local: api.jobbify-io.local/v1/users
- staging: staging-api.site-name.com/v1/users
- production: api.site-name.com/v1/users

────────────────────────────────────────

# ANGULAR APP STRUCTURE

We use Angular 22, and all components are `standalone` by default.

For every angular app:

src/app/ :

services/

store/

guards/

interceptors/

resolvers/


components/

features/

views/

pages/

layouts/


models/

constants/


scss/


src/ :

environments/

assets/



# NEST.JS APP STRUCTURE

for every nest.js app / microservice:

services/

controllers/

pipes/

interceptors/

guards/

middlewares/

Dockerfile


# ROOT REPO STRUCTURE

services/ - folder contains microservices apps

models/ - shared models between frontend and backend

constants/ - shared constants between frontend and backend

compose.yaml

samples/ - sample files

prisma/ :

data-seeding/

schema-migrations/
