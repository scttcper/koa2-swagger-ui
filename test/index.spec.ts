import * as request from 'supertest';
import * as readPkgUp from 'read-pkg-up';
import app from './example';

describe('koa2-swagger-ui', () => {
  it('should return index file', () => {
    return request(app.callback())
      .get('/docs')
      .expect('Content-Type', /html/)
      .expect(200);
  });
  it('should return index file from koa router', () => {
    return request(app.callback())
      .get('/moredocs')
      .expect('Content-Type', /html/)
      .expect(200);
  });
  it('should return css', () => {
    const version = readPkgUp.sync().pkg.devDependencies['swagger-ui-dist'];
    const url = `https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/${version}`;
    return request(url)
      .get('/swagger-ui.css')
      .expect('Content-Type', 'text/css')
      .expect(200);
  });
  it('should return icon16x16', () => {
    return request(app.callback())
      .get('/favicon-16x16.png')
      .expect('Content-Type', /png/)
      .expect(200);
  });
  it('should return icon32x32', () => {
    return request(app.callback())
      .get('/favicon-32x32.png')
      .expect('Content-Type', /png/)
      .expect(200);
  });
});
