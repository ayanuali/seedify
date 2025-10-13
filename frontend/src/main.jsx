import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import App from './App';
import './index.css';

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

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
    <ThirdwebProvider
      activeChain={PolygonAmoy}
      clientId={clientId}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
