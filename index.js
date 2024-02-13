import express from "express";
import { v4 } from "uuid";

const port = 3005;
const app = express();
app.use(express.json());

const orders = [];

const checkId = (request, response, next) => {
  const { id } = request.params;
  const index = orders.findIndex((order) => order.id === id);

  if (index < 0) {
    return response.status(404).json({ message: "request not found" });
  }
  request.orderId = id;
  request.orderIndex = index;

  next();
};

const methodAndUrl = (request, response, next) => {
  const method = request.method;
  const url = request.url;
  console.log(`- ${method}-URL => ${url}`);
  next();
};
app.use(methodAndUrl);

// rotas do tipo GET
app.get("/order", (request, response) => {
  return response.json(orders);
});

//Rotas do tipos POST
app.post("/order", methodAndUrl, (request, response) => {
  const status = "Preparação";
  const { order, clienteName, price } = request.body;

  const pedidos = { id: v4(), order, clienteName, price, status };
  orders.push(pedidos);

  return response.status(201).json(pedidos);
});
//ordern do tipo PUT
app.put("/order/:id", checkId, (request, response) => {
  const { order, clienteName, price } = request.body;
  const index = request.orderIndex;
  const id = request.orderId;

  const updateOrder = { id, order, clienteName, price };

  orders[index] = updateOrder;

  return response.json(updateOrder);
});

// Orden do tipo DELETE
app.delete("/order/:id", checkId, (request, response) => {
  const index = request.orderIndex;

  orders.splice(index, 1);

  return response.status(204).json();
});
//order do tipo GET/ID

app.get("/order/:id", checkId, (request, response) => {
  const index = request.orderIndex;

  const idUnique = orders[index];

  return response.json(idUnique);
});

// Orden do tipo PATCH
app.patch("/order/:id", checkId, (request, response) => {
  const index = request.orderIndex;
  const id = request.orderId;
  const status = "Pronto";

  const statuOrder = orders[index];

  statuOrder.status = status;

  return response.json(statuOrder);
});

app.listen(port, () => {
  console.log(`🚀serve started on port ${port}`);
});
