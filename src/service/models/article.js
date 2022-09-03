'use strict';

const {DataTypes, Model} = require(`sequelize`);
const {MAX_TITLE_COUNT, MAX_TEXT_COUNT, MAX_ANNOUNCE_COUNT} = require(`../../consts`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    // eslint-disable-next-line new-cap
    type: DataTypes[`STRING`](MAX_TITLE_COUNT),
    allowNull: false
  },
  text: {
    // eslint-disable-next-line new-cap
    type: DataTypes[`STRING`](MAX_TEXT_COUNT),
    allowNull: false
  },
  announcement: {
    // eslint-disable-next-line new-cap
    type: DataTypes[`STRING`](MAX_ANNOUNCE_COUNT),
    allowNull: false
  },
  photo: DataTypes.STRING,
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

module.exports = define;
