# Leerstandsmelder Frontend

## lsm-frontend

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn dev
```

### Compiles and minifies for production

```
yarn build

```

### Run your unit tests

```
npm run test:unit
```

### Run cypress tests

```
yarn e2e
yarn e2e:record

yarn cy:open

```

### Lints and fixes files

```
yarn lint

```

### Prettier

```
yarn format

```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Create dockerized container

Command will create a ngix based image

```
docker build -t registry.gitlab.com/leerstandsmelder/lsm-frontend:development .
```

### Run dockerized container

```
docker run -p 8080:8080 registry.gitlab.com/leerstandsmelder/lsm-frontend:development
```
