import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export async function createOrder(req, res) {
  try {
    const data = await fs.readFile('./data/orders.json', 'utf-8');
    const orders = JSON.parse(data);

    const products = req.body.cart.map((cartItem) => {
      const estimatedDeliveryTime = new Date();

      estimatedDeliveryTime.setDate(
        estimatedDeliveryTime.getDate() + 3
      );

      return {
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        estimatedDeliveryTime: estimatedDeliveryTime.toISOString(),
        variation: null
      };
    });

    const newOrder = {
      id: uuidv4(),
      orderTime: new Date().toISOString(),
      totalCostCents: req.body.totalCostCents,
      products
    };

    orders.unshift(newOrder);

    await fs.writeFile(
      './data/orders.json',
      JSON.stringify(orders, null, 2)
    );

    res.json(newOrder);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Something went wrong'
    });
  }
}

export async function getOrders(req, res) {
  try {
    const data = await fs.readFile('./data/orders.json', 'utf-8');
    const orders = JSON.parse(data);

    res.json(orders);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Something went wrong'
    });
  }
}

export async function getOrder(req, res) {
  try {
    const data = await fs.readFile('./data/orders.json', 'utf-8');
    const orders = JSON.parse(data);

    const order = orders.find((order) => {
      return order.id === req.params.orderId;
    });

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.json(order);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Something went wrong'
    });
  }
}