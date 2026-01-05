import Sequelize from "sequelize";
import databaseConfig from "../config/database.cjs";
import User from "../app/models/User.js";
import Products from "../app/models/Products.js";
import Category from "../app/models/category.js";

const models = [User, Products, Category];
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map((model) => model.init(this.connection));
  }
}

export default new Database();