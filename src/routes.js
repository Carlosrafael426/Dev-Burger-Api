import { Router } from "express";
import { v4 } from "uuid";
import User from "./app/models/User.js"

const routes = new Router();
const user = {
    id: v4(),
  name: "Carlos",
  email: "carlos@email.com",
  password_hash: "123456",
  admin: false,
};

routes.get("/", async (req, res) => {
  await User.create(user);

  res.status(201).json(user);
});

export default routes;