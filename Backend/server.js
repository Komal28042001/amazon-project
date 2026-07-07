import express from 'express';
import cors from 'cors';

import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

const app = express();

app.use(cors());
app.use(express.json());

// Home Route
app.get('/', (req, res) => {
  res.send('Amazon Backend Running');
});

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});