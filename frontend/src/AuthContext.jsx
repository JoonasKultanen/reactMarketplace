import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        // Store the token in local storage or another secure place
        localStorage.setItem("authToken", data.token);
      } else {
        // Handle login failure
        throw new Error("Failed to log in");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      // Optionally, update the UI to inform the user about the error
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    // Remove the token from local storage
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
