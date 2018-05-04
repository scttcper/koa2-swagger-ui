const request = require('supertest');

const app = require('../examples/example');

const json = require('../package.json');

describe('koa2-swagger-ui', function() {
  it('should return index file', function() {
    return request(app.callback())
      .get('/docs')
      .expect('Content-Type', /html/)
      .expect(200);
  });
  it('should return index file from koa router', function() {
    return request(app.callback())
      .get('/moredocs')
      .expect('Content-Type', /html/)
      .expect(200);
  });
  it('should return css', function() {
    const url = `https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/${json.devDependencies['swagger-ui-dist']}`;
    return request(url)
      .get('/swagger-ui.css')
      .expect('Content-Type', 'text/css')
      .expect(200);
  });
  it('should return icon16x16', function() {
    return request(app.callback())
      .get('/favicon-16x16.png')
      .expect('Content-Type', /png/)
      .expect(200);
  });
  it('should return icon32x32', function() {
    return request(app.callback())
      .get('/favicon-32x32.png')
      .expect('Content-Type', /png/)
      .expect(200);
  });
});
