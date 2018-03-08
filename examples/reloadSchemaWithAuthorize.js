const Koa = require('koa');
const koaSwagger = require('../lib/');

/*************
 * koaSwagger Configuration
 * reuse the schema security definition to authorize the user against the schema / spec
 * otherwise the user sees only the public part of the schema / spec
 * a simple header x-accesstoken is used for authorization; nothing else
 */

// hook for every request taken by swagger ui -> filter the schema request and extend it
const requestInterceptor = (req) => {
  if (window.schemaXAccessToken && window.schemaUrl && req.url === window.schemaUrl) {
    req.headers['x-accesstoken'] = window.schemaXAccessToken;
  }
  return req;
};

const reloadSchemaWithAuth = function(system) {
  return {
    statePlugins: {
      spec: {
        wrapActions: {
          // remember the current loaded schema / spec
          download: (oriAction, system) => (uri) => {
            window.schemaUrl = uri;
            return oriAction(uri);
          }
        }
      },
      auth: {
        wrapActions: {
          // remember the current x-accesstoken and reload the schema
          authorize: (oriAction, system) => (arg0) => {
            window.schemaXAccessToken = arg0['x-accesstoken'].value;
            if (window.schemaUrl) {
              system.specActions.download(window.schemaUrl);
            }
            return oriAction(arg0);
          },
          // forgot the current x-accesstoken and reload the schema
          logout: (oriAction, system) => (arg0) => {
            window.schemaXAccessToken = undefined;
            if (window.schemaUrl) {
              system.specActions.download(window.schemaUrl);
            }
            return oriAction(arg0);
          }
        }
      }
    }
  }
};

const app = new Koa();

app.use(koaSwagger({
  title: 'Portal API',
  routePrefix: '/docs/swagger',
  swaggerOptions: {
    url: `https://your.service.com/schema`,
    requestInterceptor,
    plugins: [
      reloadSchemaWithAuth,
    ]
  }
}));

/* istanbul ignore if */
if (!module.parent) {
  app.listen(3000);
  console.log('listening on: http://localhost:3000/docs/swagger');
}
