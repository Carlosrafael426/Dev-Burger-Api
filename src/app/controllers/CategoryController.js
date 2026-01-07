import * as Yup from 'yup';
import Category from '../models/category.js';

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
    const { filename } = resquest.file;

    const categoryExists = await Category.findOne({ 
      where: { 
        name,
      },
     });

    if (categoryExists) {
      return response.status(400).json({ error: 'category already exists.' });
    }

    const newCategory = await Category.create({
      name,
      path: filename,
    });

    return response.status(201).json(newCategory);
  }

   async update(resquest, response) {
    const schema = Yup.object({
      name: Yup.string(),
    });

    try {
      schema.validateSync(resquest.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    
    const { name } = resquest.body;
    const { id } = resquest.params;
    
    let path;
    if (resquest.file) {
      const { filename } = resquest.file;
      path = filename
    }
    
    const categoryExists = await Category.findOne({ 
      where: { 
        name,
      },
    });
    
    if (categoryExists) {
      return response.status(400).json({ error: 'category already exists.' });
    }
    
   await Category.update({
      name,
      path
    }, {
      where: { id }
    });

    return response.status(201).json({ message: 'Category updated successfully' });
  }
  
  async index(_resquest, response) {
    const categories = await Category.findAll();
    return response.status(200).json(categories);
  }
}

export default new CategoryController();
