const express = require('express')
const cors = require('cors')
const stripe = require('stripe')(''); //stripe secret key inside ('')
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = 4000

uuidv4();

//middle wares
app.use(express.json())
app.use(cors())

// routes
app.get('/', (req, res) => res.send('Hello World!'))

app.post('/payment', (req,res) => {
    const {product, token} = req.body;

    console.log('product', product);
    console.log('price', product.price);

    const idempotencyKey = uuidv4();

    return stripe.customers
        .create({
            email: token.email,
            source: token.id
        })
        .then(customer => {
            stripe.charges.create({
                amount: product.price * 100,
                currency: 'usd',
                receipt_email: token.email,
                description: `Purchase of ${product.name}`,
                shipping: {
                    name: token.card.name,
                    address: {
                      country: token.card.address_country
                    }
                }
            }, {idempotencyKey}
            );
        })
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err));
});

//listen
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))