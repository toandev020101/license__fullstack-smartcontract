// AuthContext.js
import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLogined, setIsLogined] = useState(false);

  return <AuthContext.Provider value={{ isLogined, setIsLogined }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
