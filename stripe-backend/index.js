const express = require('express');
const app = express();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 
const cors = require('cors');  // Importa o middleware CORS
const backendUrl = 'https://rswearing-production.up.railway.app';
const axios = require('axios'); // Add axios to make HTTP requests

app.use(cors({
  origin: ['http://localhost:8100', 'https://rswearing.online', 'https://rswearing-production.up.railway.app'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization',
}));

app.use(express.json()); // Para ler JSON no corpo da requisição


// Endpoint para criar Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  console.log('Received request for payment intent:', req.body);
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // em centavos (ex: 10 dólares = 1000 centavos)
      currency,
      payment_method_types: ['card'],
    });
    console.log('Payment intent created successfully:', paymentIntent);
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: error.message });
  }
});




// Endpoint para enviar mensagem para Botpress

// New Botpress integration reusing create-payment-intent structure
app.post('/send-botpress-message', async (req, res) => {
  const { message } = req.body; // Get the user message

  try {
    // Make a request to Botpress with user message
    const botpressResponse = await axios.post('https://webhook.botpress.cloud/6374e7a7-b100-443f-bda2-215ec7574d57', {
      message: message
    });

    // Respond with the Botpress response
    res.send({
      botResponse: botpressResponse.data,
    });
  } catch (error) {
    console.error('Error in Botpress request:', error.message);
    res.status(500).send({ error: 'Botpress request failed' });
  }
});




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
