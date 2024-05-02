import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

const LoginForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleModeChange = () => {
    setIsRegistering(!isRegistering);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let action = isRegistering ? "register" : "login";
    let data = {
      username: event.target.elements.username.value,
      password: event.target.elements.password.value,
    };

    if (isRegistering) {
      data.phone = event.target.elements.phone.value;
    }

    try {
      // Pass the action and credentials to the login function
      await login(action, data);

      // Navigate back to the login form after successful registration
      if (isRegistering) {
        setIsRegistering(!isRegistering);
      } else {
        // Navigate to the home page after successful login
        navigate("/");
      }
    } catch (error) {
      console.error("There was a problem with the login operation:", error);
    }

    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ textDecoration: "underline" }}>
        {isRegistering ? "Register" : "Login"}
      </h2>
      {!isRegistering && (
        <>
          <label>Username:</label>
          <input type="text" name="username" required />
          <label>Password:</label>
          <input type="password" name="password" required />
        </>
      )}
      {isRegistering && (
        <>
          <label>Username:</label>
          <input type="text" name="username" required />
          <label>Password:</label>
          <input type="password" name="password" required />
          <label>Phone Number:</label>
          <input type="tel" name="phone" required />{" "}
        </>
      )}
      <button type="submit" style={{ marginTop: "20px" }}>
        {isRegistering ? "Register" : "Login"}
      </button>
      <a
        href="#"
        onClick={handleModeChange}
        className="switch-link"
        style={{
          textDecoration: "underline",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        {isRegistering
          ? "Already have an account? Login here!"
          : "Don't have an account yet? Register here!"}
      </a>
    </form>
  );
};

export default LoginForm;
