import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  const authorizationToken = `Bearer ${token}`;

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const isLoggedIn = !!token;

  const LogoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  const userAuthentication = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      const responseText = await response.text();
      console.log("Response text:", responseText);

      try {
        const data = JSON.parse(responseText);
        if (response.ok) {
          console.log("user data ", data.userData);
          setUser(data.userData);
        } else {
          throw new Error(data.message || "Error fetching user data");
        }
      } catch (jsonError) {
        throw new Error("Failed to parse JSON response");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching user data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getServices = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/data/service", {
        method: "GET",
      });

      const responseText = await response.text();
      console.log("Response text:", responseText);

      try {
        const data = JSON.parse(responseText);
        if (response.ok) {
          setServices(data.msg);
        } else {
          throw new Error(data.message || "Error fetching services");
        }
      } catch (jsonError) {
        throw new Error("Failed to parse JSON response");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching services", error);
    }
  };

  useEffect(() => {
    userAuthentication();
    getServices();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLS,
        LogoutUser,
        user,
        services,
        authorizationToken,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};
