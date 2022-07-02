'use strict';

const express = require(`express`);
const request = require(`supertest`);

const categories = require(`./categories`);
const {CategoryService} = require(`../../data-service/categories`);
const {mockData} = require(`./mockData`);
const {HttpCode} = require(`../../../consts`);

const app = express();
app.use(express.json());
categories(app, new CategoryService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(4));

  test(`Category names are 'Программирование', 'За жизнь', 'IT', 'Без рамки'`,
      () => expect(response.body).toEqual(expect.arrayContaining([`Программирование`, `За жизнь`, `IT`, `Без рамки`]))
  );
});
