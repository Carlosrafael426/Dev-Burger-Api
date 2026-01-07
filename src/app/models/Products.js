import Sequelize, { Model } from 'sequelize';

class Products extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        path: Sequelize.STRING,
        offer: Sequelize.BOOLEAN,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3001/product-files/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'Products',
        underscored: true,
        timestamps: true,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Category, { 
      foreignKey: 'category_id' ,
      as: 'category'
    });
  }
}
export default Products;
