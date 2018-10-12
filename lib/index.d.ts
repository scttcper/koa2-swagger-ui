declare module 'koa2-swagger-ui' {
  import { Middleware } from 'koa';
  export function koaSwagger(config: swaggerUiConfig): any;

  export interface swaggerUiConfig {
    title?: string;
    oauthOptions?: boolean | any;
    swaggerOptions: {
      dom_id?: string,
      url: string,
      supportedSubmitMethods?: string[],
      docExpansion?: string,
      jsonEditor?: boolean,
      defaultModelRendering?: string,
      showRequestHeaders?: boolean,
      swaggerVersion?: string,
      layout?: string,
    };
    routePrefix: string;
    hideTopbar?: boolean;
    favicon16?: string;
    favicon32?: string;
  }
}
