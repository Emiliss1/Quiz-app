import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authErr, setAuthErr] = useState(false);
  const [token, setToken] = useState(() => Cookies.get("token"));
  const [isBalanceUpdate, setIsBalanceUpdate] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const tokenHeader = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DB_URL}/user/profile`,
          tokenHeader
        );
        console.log(response);
        if (response) {
          setAuthErr(false);
          setUser(response.data);
        }
      } catch (err) {
        console.log(err);
        if (err.status === 401) {
          setAuthErr(true);
        }
      }
    };
    fetchUser();
  }, [token, isBalanceUpdate]);

  const logOut = () => {
    Cookies.remove("token");
    setToken(null);
  };

  const logIn = (newToken) => {
    Cookies.set("token", newToken, { expires: 1 / 24 });
    setToken(newToken);
  };

  const handleAuthErr = (value) => {
    setAuthErr(value);
  };

  const updateBalance = () => {
    setIsBalanceUpdate(!isBalanceUpdate);
  };

  const updateToken = (newToken) => {
    setToken(newToken);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authErr,
        logOut,
        logIn,
        token,
        handleAuthErr,
        updateBalance,
        updateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
