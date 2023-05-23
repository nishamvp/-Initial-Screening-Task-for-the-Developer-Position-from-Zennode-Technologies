import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [productQuantities, setProductQuantities] = useState([0, 0, 0]);
  const [giftWrap, setGiftWrap] = useState(false);
  const [cartDetails, setCartDetails] = useState(null);

  const handleQuantityChange = (index, value) => {
    const updatedQuantities = [...productQuantities];
    updatedQuantities[index] = value;
    setProductQuantities(updatedQuantities);
  };

  const handleGiftWrapChange = (event) => {
    setGiftWrap(event.target.checked);
  };

  const calculateCart = () => {
    axios.post('http://localhost:3001/calculateCart', { productQuantities, giftWrap }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
       
      }
    })
      .then(response => {
        setCartDetails(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };
  
  

  return (
    <div>
      <h1>Shopping Cart</h1>
      <div>
        {cartDetails ? (
          <div>
            <h2>Cart Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartDetails.products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>${product.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Subtotal: ${cartDetails.subtotal}</p>
            <p>Discount Applied: {cartDetails.discountName} - ${cartDetails.discountAmount}</p>
            <p>Shipping Fee: ${cartDetails.shippingFee}</p>
            <p>Gift Wrap Fee: ${cartDetails.giftWrapFee}</p>
            <p>Total: ${cartDetails.total}</p>
          </div>
        ) : (
          <div>
            <h2>Product Quantities</h2>
            <div>
              <label>Product A:
                <input type="number" min="0" value={productQuantities[0]} onChange={(e) => handleQuantityChange(0, e.target.value)} />
              </label>
            </div>
            <div>
              <label>Product B:
                <input type="number" min="0" value={productQuantities[1]} onChange={(e) => handleQuantityChange(1, e.target.value)} />
              </label>
            </div>
            <div>
              <label>Product C:
                <input type="number" min="0" value={productQuantities[2]} onChange={(e) => handleQuantityChange(2, e.target.value)} />
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" checked={giftWrap} onChange={handleGiftWrapChange} /> Gift Wrap
              </label>
            </div>
            <button onClick={calculateCart}>Calculate Cart</button>
          </div>
        )}
      </div>
    </div>
  );
}



export default App;
