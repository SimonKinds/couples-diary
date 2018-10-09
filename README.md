# Couple's Diary
[![Build Status](https://travis-ci.org/SimonKinds/couples-diary.svg?branch=master)](https://travis-ci.org/SimonKinds/couples-diary)

Couple's Diary (CD) is a website where two people can share their daily experiences by writing about their days.

CD is build using `express` on the backend, and `react` on the frontend.
To make the handling of a monorepo easier, `lerna` is used.

## Installation
```
npx lerna bootrap
```

## Configuration
Before starting the server, create a `.env` file in `packages/server`. An example `.env` file can be seen below
```sh
JWT_SECRET=anincrediblylongsecretthatitonlyusedonmymachine?!
DB_NAME=couplesdiary
HOSTNAME=localhost
SERVER_PORT=3333
```

## Running the application (dev)
### Server

```sh
cd packages/server
npm run start
```

### Front-end
```sh
cd packages/app
npm run start
```
The website should open automatically in your browser at `http://localhost:3000`


## Production build
### Server
```sh
cd packages/server
npm run build
```

You can then run the production server by executing `npm run start:prod`.

**NOTE** that the server _does not_ serve the client files. Instead one should use other means to serve files. `nginx` is one good option.

### Client
```sh
cd packages/app
npm run build
```

## Testing
### Server

```sh
cd packages/server
npm run test:watch
```

### Front-end
```sh
cd packages/app
npm run test
```

### In CI
```sh
./scripts/test.sh
```
