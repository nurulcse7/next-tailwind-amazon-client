import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
};

export default handler;

// so we simply created an API ti get the product from backend in the MongoDB based on the ID in the URL. so, when we put an idea in this API, this API will be called and the product will be returned in the data variable. // 21 //