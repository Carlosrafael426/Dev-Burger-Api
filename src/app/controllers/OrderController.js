import * as Yup from "yup";
import Products from "../models/Products.js";
import category from "../models/category.js";
import Order from "../schemas/order.js";

class OrderController {
  async store(resquest, response) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        ),
    });

    try {
      schema.validateSync(resquest.body, { abortEarly: false, strict: true });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { userId, userName } = resquest;
    const { products } = resquest.body;

    const productIds = products.map((product) => product.id);

    const findedProducts = await Products.findAll({
      where: {
        id: productIds,
      },
      include: {
        model: category,
        as: "category",
        attributes: ["name"],
      },
    });

    const mapedProducts = findedProducts.map((product) => {
      const quantity = products.find((p) => p.Id === product.id).quantity;

      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity,
      };
      return newProduct;
    });

    const order = {
      user: {
        id: userId,
        name: userName,
      },
      products: mapedProducts,

      status: "Pedido realizado",
    };

    const newOrder = await Order.create(order);

    return response.status(201).json(newOrder);
  }

  async update(resquest, response) {
    const schema = Yup.object({
      status: Yup.string().required(),
    });

    try {
      schema.validateSync(resquest.body, { abortEarly: false, strict: true });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { status } = resquest.body;
    const { id } = resquest.params;

    try {
      await Order.updateOne({ _id: id }, { status });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response
      .status(200)
      .json({ message: "Status do pedido atualizado com sucesso" });
  }

  async index(_resquest, response) {
    const orders = await Order.find();
    return response.json(orders);
  }
}

export default new OrderController();
