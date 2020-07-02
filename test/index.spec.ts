import request from 'supertest';
import readPkgUp from 'read-pkg-up';
import app from './example';

describe('koa2-swagger-ui', () => {
  it('should return index file', async () => {
    await request(app.callback())
      .get('/docs')
      .expect('Content-Type', /html/)
      .expect(200);
  });
  it('should return index file from koa router', async () => {
    await request(app.callback())
      .get('/moredocs')
      .expect('Content-Type', /html/)
      .expect(200);
  });
  it('should return css', async () => {
    const result = readPkgUp.sync({ cwd: __dirname });
    const version = result!.packageJson.devDependencies!['swagger-ui-dist'];
    const url = `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${version}`;
    await request(url)
      .get('/swagger-ui.css')
      .expect('Content-Type', 'text/css; charset=utf-8')
      .expect(200);
  });
  it('should return spec', async () => {
    await request(app.callback())
      .get('/docs/spec')
      .expect('Content-Type', /json/)
      .expect(200);
  });
  it('should return icon16x16', async () => {
    await request(app.callback())
      .get('/favicon-16x16.png')
      .expect('Content-Type', /png/)
      .expect(200);
  });
  it('should return icon32x32', async () => {
    await request(app.callback())
      .get('/favicon-32x32.png')
      .expect('Content-Type', /png/)
      .expect(200);
  });
});
