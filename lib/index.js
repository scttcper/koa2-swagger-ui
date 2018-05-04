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
  swaggerVersion: json.devDependencies['swagger-ui-dist'],
  hideTopbar: false,
  favicon16: '/favicon-16x16.png',
  favicon32: '/favicon-32x32.png',
};

module.exports = function koaSwagger(config) {
  const extFavicon16 = config && config.favicon16;
  const extFavicon32 = config && config.favicon32;
  const favicon16Path = path.join(__dirname, defaultOptions.favicon16);
  const favicon32Path = path.join(__dirname, defaultOptions.favicon32);
  const options = defaultsDeep(config || {}, defaultOptions);
  Handlebars.registerHelper('json', context => JSON.stringify(context));
  Handlebars.registerHelper('strfnc', fnc => fnc);
  Handlebars.registerHelper('isset', function(conditional, options) { return conditional ? options.fn(this) : options.inverse(this); });
  const index = Handlebars.compile(fs.readFileSync(path.join(__dirname, './index.hbs'), 'utf-8'));

  return function koaSwaggerUi(ctx, next) {
    if (options.routePrefix === false || ctx.path === options.routePrefix) {
      ctx.type = 'text/html';
      ctx.body = index(options);
      return true;
    }
    if (!extFavicon16 && ctx.path === defaultOptions.favicon16) {
      ctx.type = 'image/png';
      ctx.body = fs.createReadStream(favicon16Path);
      return true;
    }
    if (!extFavicon32 && ctx.path === defaultOptions.favicon32) {
      ctx.type = 'image/png';
      ctx.body = fs.createReadStream(favicon32Path);
      return true;
    }
    return next();
  };
};
