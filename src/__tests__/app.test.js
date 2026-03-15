import request from 'supertest';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from '../routes/index.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.use('/', routes);

describe('GET /', () => {
  it('responds with the home page', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
