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

  async #load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles() {
    return this.#load(`/articles`);
  }

  getArticle(id) {
    return this.#load(`/articles/${id}`);
  }

  search(query) {
    return this.#load(`/search`, {params: {query}});
  }

  getAllComments() {
    return this.getArticles()
      .then(res => res.reduce((allComments, item) => [...allComments, ...item.comments], []));
  }

  async getCategories() {
    return await this.#load('/categories');
  }

  async createArticle(data) {
    return await this.#load(`/articles`, {
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
