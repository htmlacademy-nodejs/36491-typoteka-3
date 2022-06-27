const express = require(`express`);
const request = require(`supertest`);

const articles = require(`./articles`);
const {ArticlesService} = require(`../../data-service/articles`);
const {CommentsService} = require(`../../data-service/comments`);
const {mockData} = require(`./mockData`);
const {HttpCode} = require(`../../../consts`);
const cloneDeep = require('lodash.clonedeep');

const createAPI = () => {
  const app = express();
  const cloneData = cloneDeep(mockData);
  app.use(express.json());
  articles(app, new ArticlesService(cloneData), new CommentsService(cloneData));
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`First articles id equals "ERJFu_"`, () => expect(response.body[0].id).toBe(`ERJFu_`));
});

describe(`API returns an articles with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/ERJFu_`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer's title is "Обзор новейшего смартфона"`, () => expect(response.body.title).toBe(`Обзор новейшего смартфона`));
});

describe(`API creates an offer if data is valid`, () => {
  const newArticle = {
    title: `TEST Обзор новейшего смартфона`,
    categories: `Программирование`,
    announce: `TEST Простые ежедневные упражнения помогут достичь успеха. Иг`,
    fullText: `TEST Первая большая ёлка была установлена только в 1938 году. Программировать не настолько сложно как об этом говорят.`,
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `TEST Обзор новейшего смартфона`,
    categories: `Программирование`,
    announce: `TEST Простые ежедневные упражнения помогут достичь успеха. Иг`,
    fullText: `TEST Первая большая ёлка была установлена только в 1938 году. Программировать не настолько сложно как об этом говорят.`,
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badOffer = {...newArticle};
      delete badOffer[key];
      await request(app)
        .post(`/articles`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `TEST Обзор новейшего смартфона`,
    categories: `Программирование`,
    announce: `TEST Простые ежедневные упражнения помогут достичь успеха. Иг`,
    fullText: `TEST Первая большая ёлка была установлена только в 1938 году. Программировать не настолько сложно как об этом говорят.`,
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/ERJFu_`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/ERJFu_`)
    .expect((res) => expect(res.body.title).toBe(`TEST Обзор новейшего смартфона`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();

  const validArticle = {
    title: `TEST Обзор новейшего смартфона`,
    categories: `Программирование`,
    announce: `TEST Простые ежедневные упражнения помогут достичь успеха. Иг`,
    fullText: `TEST Первая большая ёлка была установлена только в 1938 году. Программировать не настолько сложно как об этом говорят.`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an articles with invalid data`, () => {
  const app = createAPI();

  const invalidArticle = {
    categories: `Программирование`,
    announce: `TEST Простые ежедневные упражнения помогут достичь успеха. Иг`,
    fullText: `TEST Первая большая ёлка была установлена только в 1938 году. Программировать не настолько сложно как об этом говорят.`,
  };

  return request(app)
    .put(`/articles/ERJFu_`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/ERJFu_`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(`ERJFu_`));

  test(`Offer count is 5 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
