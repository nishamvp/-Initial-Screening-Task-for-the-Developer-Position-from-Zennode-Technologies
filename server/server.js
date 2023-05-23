const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const products = [
  { name: 'Product A', price: 20 },
  { name: 'Product B', price: 40 },
  { name: 'Product C', price: 50 },
];

app.post('/calculateCart', (req, res) => {
  const { productQuantities, giftWrap } = req.body;

  // Calculate cart details
  let subtotal = 0;
  let totalQuantity = 0;
  let shippingFee = 0;
  let giftWrapFee = 0;
  let discountName = '';
  let discountAmount = 0;

  let cartProducts = productQuantities.map((quantity, index) => {
    let numberQuantity=Number(quantity)
    let product = products[index];
    let { name, price } = product;
    let total = numberQuantity * price;
    subtotal += total; 
    totalQuantity += numberQuantity;

    // Bulk 5% discount
    if (totalQuantity > 10) {
      let bulkDiscount = Number(price) * 0.05 ;
      total -= bulkDiscount;
      discountName = 'bulk_5_discount';
      discountAmount += bulkDiscount;
    }

    return {
      name,
      quantity,
      total,
    };
  });

  // Bulk 10% discount
  if (totalQuantity > 20) {
    let bulkDiscount = subtotal * 0.1;
    subtotal -= bulkDiscount;
    discountName = 'bulk_10_discount';
    discountAmount = bulkDiscount;
  }

  // Tiered 50% discount
  if (totalQuantity > 30 && productQuantities.some(quantity => quantity > 15)) {
    let productsAbove15Quantity = productQuantities.filter(quantity => quantity > 15);
    let quantityAbove15 = productsAbove15Quantity.reduce((acc, quantity) => acc + quantity, 0);
    let tieredDiscount = productsAbove15Quantity.map((quantity, index) => {
      let product = products[index];
      let { name, price } = product;
      let discount = (price * 0.5 * quantity) * 0.5; // 50% discount on quantity above 15
      discountAmount += discount;
      return {
        name,
        quantity: quantity - 15,
        total: discount,
      };
    });
    cartProducts.push(...tieredDiscount);
    discountName = 'tiered_50_discount';
    subtotal -= discountAmount;
  }

  // Flat $10 discount
  if (subtotal > 200) {
    subtotal -= 10;
    discountName = 'flat_10_discount';
    discountAmount = 10;
  }

  const numPackages = Math.ceil(totalQuantity / 10);
  shippingFee = numPackages * 5;

  if (giftWrap) {
    giftWrapFee = totalQuantity * 1; // $1 per unit for gift wrapping
  }

  const total = subtotal + shippingFee + giftWrapFee;

  const cartDetails = {
    products: cartProducts,
    subtotal,
    discountName,
    discountAmount,
    shippingFee,
    giftWrapFee,
    total,
  };

  res.json(cartDetails);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
