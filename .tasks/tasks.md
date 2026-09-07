# TASKS

# SPECS

✓ Add Specs for SDD (Spec Driven Development)

Format specs text (common.instructions.md)


✓ Backend Specs: Add check for maximum page size (maximum 100 results per 1 request):
```
const MAXIMUM_PAGE_SIZE = 100;
const isSizeValid: boolean = (req.params.limit - req.params.offset) < MAXIMUM_PAGE_SIZE;
```

# INFRASTRUCTURE

Rename repo to jobbify-io

## Monorepo

Create monorepo structure and add services:

- Admin WebUI Service; for the Angular administration web-app
- User Service;
- Technology Service;
- Level Service;
- Position Service;
- Employment Type Service;

## LOCAL SERVER PREPARATIONS

- Add data-seeding script with Prisma to initialize data in MongoDB and run this script;
- Create Dockerfile and compose.yml and .env file
- Create sample .env files /env-samples folder: sample.local.env, sample.development.env, sample.testing.env, sample.staging.env, sample.production.env files in /envs folder;
- Create NgInx config for all of the links for local environment (see LINKS section)
- Create NgInx sample configs for environments: local, development, testing, staging, production
- Run NgInx with the config for local environment;

# BACKEND

Regen json-file: replace UUIDs to Mongo ObjectIds and save all of the relations

## CREATE API

- UserService; GET /api/users ? aggregated=true
  & techId=`<techId>` & levelId=`<levelId>` & positionId=`<positionId>` & emplTypeId=`<emplTypeId>`
  & fullnameQuery=`<string>` & emailQuery=`<string>`
  & offset=`<number>` & limit=`<number>`;
- Technology Service; GET /api/technologies
- Level Service; GET /api/levels
- Position Service; GET /api/positions
- Employment Type Service; GET /api/employment-types
