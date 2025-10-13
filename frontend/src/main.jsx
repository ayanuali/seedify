import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import App from './App';
import './index.css';

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

// local hardhat network configuration
const localhost = {
  chainId: 31337,
  rpc: ['http://127.0.0.1:8545'],
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  shortName: 'localhost',
  slug: 'localhost',
  testnet: true,
  chain: 'ETH',
  name: 'Localhost 8545',
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain={localhost}
      clientId={clientId}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
