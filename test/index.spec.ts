import { describe, expect, it } from '@jest/globals';
import { sync as readPkgUpSync } from 'read-pkg-up';
import request from 'supertest';

import app from './example';

describe('koa2-swagger-ui', () => {
  it('should return index file', async () => {
    await request(app.callback())
      .get('/docs')
      .expect('Content-Type', /html/)
      .expect(200);
  });
  it('should return index file with // on end', async () => {
    await request(app.callback())
      .get('/docs//')
      .expect('Content-Type', /html/)
      .expect(200);
  });
  it('should not return index file with ///2 on end', async () => {
    await request(app.callback())
      .get('/docs///2')
      .expect('Content-Type', /plain/)
      .expect(404);
  });
  it('should return index file from koa router', async () => {
    await request(app.callback())
      .get('/moredocs')
      .expect('Content-Type', /html/)
      .expect(200);
  });
  it('should return css', async () => {
    const result = readPkgUpSync({ cwd: __dirname });
    const version = result!.packageJson.devDependencies!['swagger-ui-dist'];
    expect(version).toBeDefined();
    const url = `https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/${version}`;
    await request(url)
      .get('/swagger-ui.min.css')
      .expect('Content-Type', 'text/css; charset=utf-8')
      .expect(200);
  });
  it('should return spec', async () => {
    await request(app.callback())
      .get('/docs/spec')
      .expect('Content-Type', /json/)
      .expect(200);
  });
  it('should return spec with / on end', async () => {
    await request(app.callback())
      .get('/docs/spec/')
      .expect('Content-Type', /json/)
      .expect(200);
  });
  it('should not return spec with /l on end', async () => {
    await request(app.callback())
      .get('/docs/spec/l')
      .expect('Content-Type', /plain/)
      .expect(404);
  });
  it('should return favicon', async () => {
    await request(app.callback())
      .get('/favicon.png')
      .expect('Content-Type', /png/)
      .expect(200);
  });
});
