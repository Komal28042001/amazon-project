import products from './data/products.json' with { type: 'json' };

export function getProducts(req, res) {
  res.json(products);
}