const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cart Routes
app.post('/api/cart', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    // TODO: Implement cart addition logic
    res.json({ message: 'Product added to cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/cart/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    // TODO: Implement cart removal logic
    res.json({ message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Checkout Route
app.post('/api/checkout', async (req, res) => {
  try {
    const { items, userId } = req.body;
    // TODO: Implement checkout logic
    res.json({ message: 'Checkout successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
