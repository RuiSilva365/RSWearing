const express = require('express');
const app = express();
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51PzoiU01Wt7ByK5npt4a6KVEYFdMm7sQNQCxWbzOlNPDkVIrx3DdK6FQTTjzhY1uKTfkyDsx8ashrXnKcLQe0xp200i5IQeXRZ'); // Substitui pela tua chave secreta do Stripe
const cors = require('cors');  // Importa o middleware CORS


app.use(cors({
  origin: ['http://localhost:8100', 'https://rswearing.online'],  // Permitir requisições do teu site oficial e localhost
}));
app.use(express.json()); // Para ler JSON no corpo da requisição


// Endpoint para criar Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // em centavos (ex: 10 dólares = 1000 centavos)
      currency,
      payment_method_types: ['card'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
