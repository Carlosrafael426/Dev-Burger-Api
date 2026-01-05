import * as Yup from "yup";
import Category from "../models/category.js";
class CategoryController {
  async store(resquest, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
    });

    try {
      schema.validateSync(resquest.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }
    const { name } = resquest.body;

    const categoryExists = await Category.findOne({ where: { name } });

    if (categoryExists) {
      return response.status(400).json({ error: "Category already exists." });
    }


    const newCategory = await Category.create({
      name,
    });

    return response.status(201).json(newCategory);
  }

  async index(_resquest, response) {
    const categories = await Category.findAll();
    return response.status(200).json(categories);
  }
}

export default new CategoryController;