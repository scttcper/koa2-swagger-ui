# koa2-swagger-ui [![NPM version][npm-image]][npm-url] [![CircleCI](https://circleci.com/gh/scttcper/koa2-swagger-ui.svg?style=svg)](https://circleci.com/gh/scttcper/koa2-swagger-ui)

[npm-image]: https://img.shields.io/npm/v/koa2-swagger-ui.svg
[npm-url]: https://npmjs.org/package/koa2-swagger-ui
[travis-img]: https://api.travis-ci.org/scttcper/koa2-swagger-ui.svg?branch=master
[travis-url]: https://travis-ci.org/scttcper/koa2-swagger-ui
[coverage-img]: https://codecov.io/gh/scttcper/koa2-swagger-ui/branch/master/graph/badge.svg
[coverage-url]: https://codecov.io/gh/scttcper/koa2-swagger-ui

> Host swagger ui at a given directory from your koa v2 app

Inspired by:

* [swagger-injector](https://github.com/johnhof/swagger-injector) for serving on a specific route
* [hapi-swaggered-ui](https://github.com/z0mt3c/hapi-swaggered-ui) for serving files from node_modules using a handlebars driven index.html

## install

```
npm install koa2-swagger-ui --save
```

## config

for more swaggerOptions see [swagger-ui](https://github.com/swagger-api/swagger-ui#swaggerui)
defaults:

```javascript
title: 'swagger', // page title
oauthOptions: {}, // passed to initOAuth
swaggerOptions: { // passed to SwaggerUi()
  dom_id: 'swagger-ui-container',
  url: 'http://petstore.swagger.io/v2/swagger.json', // link to swagger.json
  supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
  docExpansion: 'none',
  jsonEditor: false,
  defaultModelRendering: 'schema',
  showRequestHeaders: false,
  swaggerVersion: 'x.x.x' // read from package.json,
},
routePrefix: '/docs', // route where the view is returned
hideTopbar: false, // hide swagger top bar
favicon16: '/favicon-16x16.png', // default icon 16x16, set for self icon
favicon32: '/favicon-32x32.png', // default icon 32x32, set for self icon
```

## example

```javascript
const Koa = require('koa');
const koaSwagger = require('koa2-swagger-ui');

const app = new Koa();

app.use(
  koaSwagger({
    routePrefix: '/swagger', // host at /swagger instead of default /docs
    swaggerOptions: {
      url: 'http://petstore.swagger.io/v2/swagger.json', // example path to json
    },
  }),
);

app.listen(3000);
```

## example with koa-router and yaml source
depends on yamljs to turn your Yaml into a JS object
```
npm install --save yamljs
```
```javascript
const Koa = require('koa');
const Router = require('koa-router');
const yamljs = require('yamljs');
const koaSwagger = require('koa2-swagger-ui');

const router = new Router({ prefix: '/' });

const app = new Koa();
const router = new Router();

// .load loads file from root.
const spec = yaml2js.load('./openapi.yaml');

router.use(koaSwagger());
router.get('/docs', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));

app.use(router.routes());
app.listen(3000);
```
