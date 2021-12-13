import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import StripeCheckout from "react-stripe-checkout";

function App() {

    const [product, setProduct] = useState({
        name: 'React from FB',
        price: 10,
        productBy: "facebook",
    });

    const makePayment = token => {

        const body = {
            token,
            product
        }

        return fetch("http://localhost:4000/payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                return response.json();
            })
            .catch(err => console.log(err));
    }

    return (
    <div className="App">
      <header className="App-header">
          <StripeCheckout
              token={makePayment}
              stripeKey="" //stripe publishable key inside stripeKey=""
              name="Buy React"
              amount={product.price * 100}
              shippingAddress
              billingAddress
              zipCode
              currency="USD"
          >
              <button className="btn btn-large-blue">
                  Buy using Stripe
              </button>
          </StripeCheckout>

      </header>
    </div>
  );
}

export default App;
