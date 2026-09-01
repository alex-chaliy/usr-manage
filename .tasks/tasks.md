

# TASKS (for future)

## SPECS

✓ Add Specs for SDD (Spec Driven Development)

Format specs text

## STRUCTURE

Rename repo to jobbify-io

## FRONTEND

### Admin App

~~Fix infinite table width~~ 

✓ replace dropdowns with PrimeNG dropdowns (filter dropdowns and page-size-dropdowns)

✓ implement routing with lazy loading

✓ Fix mappings: 
- in user-service
- in user table

✓ Add 'idle' to AsyncState
('idle' - before anything was requested from the api)


Replace the existed users data-table/data-table-infinite with PrimeNG Table and PrimeNG Scroller (allows to use both - virtual and infinite scroll features);

Replace pagination-mode-toggle with PrimeNG switch-component

Replace input-fields with PrimeNg input-fields


Wrap table with ngx-scrollbar lib to add perfect scrollbar in ui;

Move from usual variables to signals

Add Reactive Forms to name and email inputs


Add environments for: 
  - local
  - ✓ development
  - testing 
  - staging
  - ✓ production 

✓ Add main page component, lazy-load it with url '/';


Move filters-bar, data-table, data-table-infinite to separate components; no communications through Outputs;

Create NGRX Store and setup store interactions between filters-bar and data-table/data-table-infinite

Fix design


Switch Unit-test library from Karma + Jasmine to Jest

Cover Users Table with unit-tests 


## BACKEND

Regen json-file: replace UUIDs to Mongo ObjectIds and save all of the relations

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

## CREATE API

- UserService; GET /api/users ? aggregated=true
  & techId=`<techId>` & levelId=`<levelId>` & positionId=`<positionId>` & emplTypeId=`<emplTypeId>`
  & fullnameQuery=`<string>` & emailQuery=`<string>`
  & offset=`<number>` & limit=`<number>`;
- Technology Service; GET /api/technologies
- Level Service; GET /api/levels
- Position Service; GET /api/positions
- Employment Type Service; GET /api/employment-types


