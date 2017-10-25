const path = require('path');
const fs = require('fs');
const defaultsDeep = require('lodash.defaultsdeep');
const Handlebars = require('handlebars');

const json = require('../package.json');

const defaultOptions = {
  title: 'Swagger UI',
  oauthOptions: false,
  swaggerOptions: {
    dom_id: '#swagger-ui',
    url: 'http://petstore.swagger.io/v2/swagger.json',
    layout: 'StandaloneLayout',
  },
  routePrefix: '/docs',
  swaggerVersion: json.devDependencies['swagger-ui'],
  hideTopbar: false,
};

module.exports = function koaSwagger(config) {
  const options = defaultsDeep(config || {}, defaultOptions);
  Handlebars.registerHelper('json', context => JSON.stringify(context));
  const index = Handlebars.compile(fs.readFileSync(path.join(__dirname, './index.hbs'), 'utf-8'));

  return function koaSwaggerUi(ctx, next) {
    if (options.routePrefix === false || ctx.path === options.routePrefix) {
      ctx.type = 'text/html';
      ctx.body = index(options);
      return true;
    }
    return next();
  };
};
