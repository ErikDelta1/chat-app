import React, { useState } from "react";
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //const user = userCredential.user;
        navigate("/dashboard");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          setError("Invalid email address.");
        } else if (error.code === "auth/missing-password") {
          setError("Password is missing.");
        } else if (error.code === "auth/invalid-credential") {
          setError("User not found.");
        }
        else {
          setError("An error occurred. Please try again later.");
        }
      });
  };

  return (
    <div className="login-wrapper">
        <div className="login-container">
          <h1>Login</h1>
          <form onSubmit={handleSubmit} noValidate>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          {error && <p className="error-message">{error}</p>}
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
    </div>
  );
};

export default Login;