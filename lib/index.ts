import { readFileSync, createReadStream } from 'fs';
import Handlebars, { HelperDelegate, HelperOptions } from 'handlebars';
import { defaultsDeep } from 'lodash';
import { join } from 'path';
import { sync as readPkgUpSync } from 'read-pkg-up';
import { Context, Middleware, Next } from 'koa';

export interface SwaggerOptions {
  [key: string]: string | boolean | string[] | Record<string, unknown>;
  dom_id: string;
  url: string;
  supportedSubmitMethods: string[];
  docExpansion: string;
  jsonEditor: boolean;
  defaultModelRendering: string;
  showRequestHeaders: boolean;
  layout: string;
  spec: Record<string, unknown>;
}

export interface KoaSwaggerUiOptions {
  title: string;
  oauthOptions: boolean | any;
  swaggerOptions: Partial<SwaggerOptions>;
  swaggerVersion: string;
  routePrefix: string | false;
  specPrefix: string,
  exposeSpec: boolean,
  hideTopbar: boolean;
  favicon16: string;
  favicon32: string;
}

const defaultOptions: KoaSwaggerUiOptions = {
  title: 'Swagger UI',
  oauthOptions: false,
  swaggerOptions: {
    dom_id: '#swagger-ui',
    url: 'https://petstore.swagger.io/v2/swagger.json',
    layout: 'StandaloneLayout',
  },
  routePrefix: '/docs',
  specPrefix: '/docs/spec',
  swaggerVersion: '',
  exposeSpec: false,
  hideTopbar: false,
  favicon16: '/favicon-16x16.png',
  favicon32: '/favicon-32x32.png',
};

function koaSwagger(config: Partial<KoaSwaggerUiOptions> = {}): Middleware {
  if (config.swaggerVersion === undefined) {
    const pkg = readPkgUpSync({ cwd: __dirname });
    if (pkg === undefined) {
      throw new Error('Package not found');
    }

    defaultOptions.swaggerVersion = pkg.packageJson.devDependencies!['swagger-ui-dist'];
  }

  // Setup icons
  const extFavicon16 = config.favicon16;
  const extFavicon32 = config.favicon32;
  const favicon16Path = join(__dirname, defaultOptions.favicon16);
  const favicon32Path = join(__dirname, defaultOptions.favicon32);

  // Setup default options
  const options: KoaSwaggerUiOptions = defaultsDeep(config, defaultOptions);
  Handlebars.registerHelper('json', context => JSON.stringify(context));
  Handlebars.registerHelper('strfnc', (fnc: HelperDelegate) => fnc);
  Handlebars.registerHelper('isset', function (this: any, conditional: any, opt: HelperOptions) {
    return conditional ? opt.fn(this) : opt.inverse(this);
  });
  const index = Handlebars.compile(readFileSync(join(__dirname, './index.hbs'), 'utf-8'));

  // eslint-disable-next-line func-names
  return function koaSwaggerUi(ctx: Context, next: Next) {
    if (options.exposeSpec && ctx.path === options.specPrefix) {
      ctx.body = options.swaggerOptions.spec;
      return true;
    }

    if (options.routePrefix === false || ctx.path === options.routePrefix) {
      ctx.type = 'text/html';
      ctx.body = index(options);
      return true;
    }

    if (extFavicon16 === undefined && ctx.path === defaultOptions.favicon16) {
      ctx.type = 'image/png';
      ctx.body = createReadStream(favicon16Path);
      return true;
    }

    if (extFavicon32 === undefined && ctx.path === defaultOptions.favicon32) {
      ctx.type = 'image/png';
      ctx.body = createReadStream(favicon32Path);
      return true;
    }

    return next();
  };
}

export default koaSwagger;
module.exports = koaSwagger;
