import React, { createContext, useState } from 'react';

const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  return <WalletContext.Provider value={{ isConnected, setIsConnected }}>{children}</WalletContext.Provider>;
};

export { WalletContext, WalletProvider };
