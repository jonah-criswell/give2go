# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

## Production Database (Postgres)

In production, this app uses Postgres. You must set the following environment variables:

- `PG_DATABASE` (default: give2go_production)
- `PG_USERNAME` (default: postgres)
- `PG_PASSWORD` (default: empty)
- `PG_HOST` (default: localhost)
- `PG_PORT` (default: 5432)

You can use a managed Postgres service or run your own instance. Make sure the database exists and the credentials are correct before deploying.

To create the database and run migrations:

```
RAILS_ENV=production bin/rails db:setup
```
