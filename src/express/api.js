'use strict';

const axios = require(`axios`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({comments, offset, limit}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getAllComments() {
    return this.getArticles()
      .then((res) => res.reduce((allComments, item) => [...allComments, ...item.comments], []));
  }

  async getCategories(count) {
    return await this._load(`/categories`, {params: {count}});
  }

  async createArticle(data) {
    return await this._load(`/articles`, {
      method: `POST`,
      data
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
