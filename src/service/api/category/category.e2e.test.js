'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDatabase = require(`../../lib/init-db`);
const category = require(`./category`);
const {CategoryService} = require(`../../data-service/category`);

const {HttpCode} = require(`../../../consts`);
const {mockData, mockCategories} = require(`./mockData`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDatabase(mockDB, {categories: mockCategories, articles: mockData});
  category(app, new CategoryService(mockDB));
});

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 4 categories`, () => expect(response.body.length).toBe(4));

  test(`Category names are "Программирование", "Без рамки", "За жизнь", "IT"`,
    () => expect(response.body.map((it) => it.name)).toEqual(
      expect.arrayContaining([`Программирование`, `Без рамки`, `За жизнь`, `IT`])
    )
  );
});
