
import * as Yup from 'yup';
import Products from '../models/Products.js';
import category from '../models/category.js';

class ProductController {
  async store(resquest, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required().positive(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    });

    try {
      schema.validateSync(resquest.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }
    const { name, price, category_id, offer } = resquest.body;
    const { filename } = resquest.file;

    const newProduct = await Products.create({
      name,
      price,
      category_id,
      path: filename,
      offer,
    });

    return response.status(201).json(newProduct);
  }
  async update(resquest, response) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number().positive(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    });

    try {
      schema.validateSync(resquest.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { name, price, category_id, offer } = resquest.body;
    const {id} = resquest.params;

    let path
    if (resquest.file) {
      const { filename } = resquest.file;
      path = filename;
    }

    await Products.update({
      name,
      price,
      category_id,
      path,
      offer,
    }, {
      where: { 
        id,
      },
    });

    return response.status(201).json({ message: 'Product updated successfully' });
  }

  async index(_resquest, response) {
    const products = await Products.findAll({ 
      include: {
        model: category,
        as: 'category',
        attributes: ['id', 'name'],
      },
    });


    return response.status(200).json(products);

  }
}

export default new ProductController();
