import { useState } from 'react';
import { ConnectWallet, useAddress } from '@thirdweb-dev/react';
import './App.css';
import CreateJob from './components/CreateJob';
import JobsList from './components/JobsList';

function App() {
  const address = useAddress();
  const [activeTab, setActiveTab] = useState('jobs');

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <h1 className="logo">FreelancePay</h1>
          <div className="nav-right">
            <ConnectWallet />
          </div>
        </div>
      </nav>

      {address ? (
        <div className="container main-content">
          <div className="tabs">
            <button
              className={activeTab === 'jobs' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('jobs')}
            >
              My Jobs
            </button>
            <button
              className={activeTab === 'create' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('create')}
            >
              Create Job
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'jobs' && <JobsList address={address} />}
            {activeTab === 'create' && <CreateJob address={address} />}
          </div>
        </div>
      ) : (
        <div className="connect-prompt">
          <h2>Connect Your Wallet</h2>
          <p>Connect to start creating jobs or getting paid for your work</p>
        </div>
      )}
    </div>
  );
}

export default App;
