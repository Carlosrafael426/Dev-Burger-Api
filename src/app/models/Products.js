import Sequelize, { Model } from "sequelize";

class Products extends Model {
  static init(sequelize) {
    Model.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        category: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3001/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: "Products",
        underscored: true,
        timestamps: true,
      }
    );
  }
}
export default Products;
