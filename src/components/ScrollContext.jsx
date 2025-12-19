import React, { createContext, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollContext = createContext();

// This provider will be used to wrap the app
export const ScrollProvider = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]); 

  return (
    <ScrollContext.Provider value={{}}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  return useContext(ScrollContext);
};