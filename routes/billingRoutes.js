const keys = require('../config/keys')
const bodyParser = require("body-parser")
const stripe = require('stripe')(keys.stripeSecretKey)
const requireLogin = require("../middlewares/requireLogin")


module.exports = app => {
  const calculateOrderAmount = items => {
    return 500;
  };

  app.post('/api/payments', bodyParser.raw({ type: 'application/json' }), requireLogin, async (req, res) => {
    let event;

    try {
      event = { type: "payment_intent.succeeded" };
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const { items } = req.body;

    if (req.body.userId == '') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: 'usd',
        metadata: { user: req.user.id },
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
        paymentIntent: paymentIntent
      })
    } else {
      req.user.credits += 5;
      const user = await req.user.save();
      res.send(user);
    }
  });
};
