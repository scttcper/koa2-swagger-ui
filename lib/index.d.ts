declare module 'koa2-swagger-ui' {
  function koaSwagger(config: SwaggerUiConfig): import('koa').Middleware;
  export interface SwaggerUiConfig {
    title?: string;
    oauthOptions?: boolean | any;
    swaggerOptions: {
      dom_id?: string;
      url: string;
      supportedSubmitMethods?: string[];
      docExpansion?: string;
      jsonEditor?: boolean;
      defaultModelRendering?: string;
      showRequestHeaders?: boolean;
      swaggerVersion?: string;
      layout?: string;
    };
    routePrefix: string | false;
    hideTopbar?: boolean;
    favicon16?: string;
    favicon32?: string;
  }
  export = koaSwagger
}

