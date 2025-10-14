import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

// Create a client for react-query
const queryClient = new QueryClient();

// Polygon Amoy testnet configuration
const PolygonAmoy = {
  chainId: 80002,
  rpc: ['https://rpc-amoy.polygon.technology'],
  nativeCurrency: {
    decimals: 18,
    name: 'POL',
    symbol: 'POL',
  },
  shortName: 'amoy',
  slug: 'polygon-amoy',
  testnet: true,
  chain: 'Polygon',
  name: 'Polygon Amoy Testnet',
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider
        activeChain={PolygonAmoy}
        clientId={clientId}
      >
        <App />
      </ThirdwebProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
