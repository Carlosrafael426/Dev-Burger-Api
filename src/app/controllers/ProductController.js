import * as Yup from "yup";
import Products from "../models/Products.js";
class ProductController {
  async store(resquest, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required().positive(),
      category: Yup.string().required(),
    });

    try {
      schema.validateSync(resquest.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }
    const { name, price, category } = resquest.body;
    const { filename } = resquest.file;

    const newProduct = await Products.create({
      name,
      price,
      category,
      path: filename,
    });

    return response.status(201).json(newProduct);
  }

  async index(_resquest, response) {
    const products = await Products.findAll();
    return response.status(200).json(products);
  }
}

export default new ProductController();
