import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Mumbai } from '@thirdweb-dev/chains';
import App from './App';
import './index.css';

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain={Mumbai}
      clientId={clientId}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
