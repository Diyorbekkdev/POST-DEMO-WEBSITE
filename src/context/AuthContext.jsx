import { createContext, useState } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

import { EXPIRE_DATE, TOKEN } from "../const";

export const AuthContext = createContext();

const checkTokenAvailability = () => {
  const token = Cookies.get(TOKEN);
  const expireDate = Cookies.get(EXPIRE_DATE);
  if (token && expireDate >= Date.now()) {
    return true;
  }
  return false;
};

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    checkTokenAvailability()
  );
  
  let state = {
    isAuthenticated,
    setIsAuthenticated,
  };
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

AuthContextProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthContextProvider;