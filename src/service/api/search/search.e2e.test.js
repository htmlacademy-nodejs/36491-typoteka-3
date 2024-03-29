'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDatabase = require(`../../lib/init-db`);
const search = require(`./search`);
const {SearchService} = require(`../../data-service/search`);

const {mockData, mockCategories} = require(`./mockData`);
const {HttpCode} = require(`../../../consts`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDatabase(mockDB, {categories: mockCategories, articles: mockData});
  search(app, new SearchService(mockDB));
});

describe(`API returns article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        q: `Обзор новейшего смартфона`
      });
  });

  test(`Status code 200`, async () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`1 article found`, async () => {
    expect(response.body.length).toBe(1);
  });

  test(`Article has correct title`, async () => {
    expect(response.body[0].title).toBe(`Обзор новейшего смартфона`);
  });
});

test(`API returns code 404 if nothing is found`, async () => {
  await request(app)
    .get(`/search`)
    .query({
      q: `Продам свою душу`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns 400 when query string is absent`, async () => {
  await request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST);
});
