import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Retrieve the user from the local storage
  const retrieveUser = () => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    retrieveUser();
  }, []);

  const login = async (action, credentials) => {
    try {
      const url =
        action === "register"
          ? "http://localhost:5000/api/auth/register"
          : "http://localhost:5000/api/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the authentication state
        setIsLoggedIn(true);
        // Store the token in local storage
        localStorage.setItem("authToken", data.token);
        // Store user information in local storage
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log(
          "Unparsed user data stored in localStorage:",
          localStorage.getItem("user")
        );
      } else {
        // Handle login failure
        throw new Error("Failed to log in");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    // Remove the token and user information from local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};
