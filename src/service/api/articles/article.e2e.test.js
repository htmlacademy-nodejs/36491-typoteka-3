'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDatabase = require(`../../lib/init-db`);
const article = require(`./articles`);
const {ArticlesService} = require(`../../data-service/articles`);
const {CommentsService} = require(`../../data-service/comments`);

const {mockData, mockCategories} = require(`./mockData`);
const {HttpCode} = require(`../../../consts`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDatabase(mockDB, {categories: mockCategories, articles: mockData});
  const app = express();
  app.use(express.json());
  article(app, new ArticlesService(mockDB), new CommentsService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
  test(`First articles title equals "Ёлки. История деревьев"`, () => expect(response.body[0].title).toBe(`Ёлки. История деревьев`));
});

describe(`API returns an articles with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    photo: ``,
    title: `TEST Обзор новейшего смартфона`,
    category: `Программирование`,
    announcement: `TEST Простые ежедневные упражнения помогут достичь успеха. Иг`,
    text: `TEST Первая большая ёлка была установлена только в 1938 году. Программировать не настолько сложно как об этом говорят.`,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    photo: `321.jpg`,
    title: `TEST Обзор новейшего смартфона`,
    categories: [1],
    announcement: `TEST TESTTESTTEST`,
    text: `TEST TESTTEST`,
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/1`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/1`)
    .expect((res) => expect(res.body.title).toBe(`TEST Обзор новейшего смартфона`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = await createAPI();

  const validArticle = {
    title: `TEST Обзор новейшего смартфона`,
    categories: [1],
    announcement: `TEST Простые ежедневные упражнения помогут достичь успеха. Иг`,
    text: `TEST Первая большая ёлка была установлена только в 1938 году. Программировать не настолько сложно как об этом говорят.`,
  };

  return request(app)
    .put(`/articles/20`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/1/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `test test test`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/1/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns changed comment`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

describe(`API correctly deletes an comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1/comments/1`);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comment count is 1 now`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(1))
  );
});
