# Financial

This application was developed for a college project.
The project consists of an API for registering account types and bills with a three-level permission system: Admin, Finance, Manager.

## Environment Variables

To run this project, you need to copy the ​​environment variables from the .env.example file and populate it.
The files you need to fill in are: .env, .env.dev, .env.test

## Run Locally

Clone the project

```bash
  git clone https://github.com/gleysonabreu/financial.git
```

Go to the project directory

```bash
  cd financial
```

Install dependencies

```bash
  npm install
  or
  yarn install
```

Install migrations

```bash
npm run typeorm migration:run
or
yarn typeorm migration:run
```

Start the server

```bash
  npm run dev
  or
  yarn dev
```

## DOCS

After you start the server you can access the documentation at the following link:

- [http://localhost:3333/api-docs](http://localhost:3333/api-docs)

## Running Tests

To run tests, run the following command

```bash
  npm run test
  or
  yarn test
```

## Demo

- [DOCS](https://financial-api-v2.herokuapp.com/api-docs)
- [API](https://financial-api-v2.herokuapp.com/)

## Tech

- [Node](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [TypeORM](https://typeorm.io/)
- [Swagger](https://swagger.io/)

## Authors

- [@gleysonabreu](https://www.github.com/gleysonabreu)
