const express = require('express');
const app = express();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 
const cors = require('cors');  // Importa o middleware CORS
const backendUrl = 'https://rswearing-production.up.railway.app';

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


// Chatbot Message Endpoint (REUSE CONFIG)
app.post('/send-botpress-message', async (req, res) => {
  const { message } = req.body;
  console.log("Received chatbot message:", message);

  try {
    const response = await axios.post('https://webhook.botpress.cloud/6374e7a7-b100-443f-bda2-215ec7574d57', { message });
    console.log('Botpress response:', response.data);
    res.send(response.data); // Send Botpress response back to the frontend
  } catch (error) {
    console.error('Error communicating with Botpress:', error.message);
    res.status(500).send({ error: 'Failed to communicate with Botpress' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
