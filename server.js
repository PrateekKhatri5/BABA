const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Helius API Configuration
const HELIUS_API_BASE = 'https://api.helius.dev/v0';
const HELIUS_API_KEY = 'aa14bf75-e41d-432f-bb37-0647cf3d4c9c'; 

// Helper function to fetch wallet data from Helius
async function fetchWalletData(address) {
  try {
    // Helius API endpoint to fetch tokens
    const response = await axios.get(`${HELIUS_API_BASE}/addresses/${address}/balances?api-key=${HELIUS_API_KEY}`);

    return response.data;
  } catch (error) {
    console.error('Error fetching wallet data:', error.response?.status, error.response?.data);
    throw new Error('Unable to fetch wallet data');
  }
}

// Endpoint to get wallet balances and tokens
app.get('/api/wallet/:address', async (req, res) => {
  const { address } = req.params;

  try {
    const walletData = await fetchWalletData(address);

    // Extract SOL balance and token data
    const solBalance = walletData.nativeBalance / 1e9; // Convert lamports to SOL
    const tokens = walletData.tokens.map((token) => ({
      symbol: token.tokenSymbol || 'Unknown',
      amount: token.amount,
      mintAddress: token.mint,
    }));

    res.json({
      address,
      solBalance,
      tokens,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
