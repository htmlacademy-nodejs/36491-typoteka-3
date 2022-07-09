'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const {SearchService} = require(`../../data-service/search`);
const {mockData} = require(`./mockData`);
const {HttpCode} = require(`../../../consts`);

const app = express();
app.use(express.json());
search(app, new SearchService(mockData));

describe(`API returns article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Обзор новейшего смартфона`
      });
  });

  test(`Status code 200`, async () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`1 article found`, async () => {
    expect(response.body.length).toBe(1);
  });

  test(`Article has correct id`, async () => {
    expect(response.body[0].id).toBe(`ERJFu_`);
  });
});

test(`API returns code 404 if nothing is found`, async () => {
  await request(app)
    .get(`/search`)
    .query({
      query: `Продам свою душу`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns 400 when query string is absent`, async () => {
  await request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST);
});
