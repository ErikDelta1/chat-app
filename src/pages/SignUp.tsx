import React, { useState } from "react";
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import "../styles/signUp.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //const user = userCredential.user;
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error.code)

        if (error.code === "auth/email-already-in-use") {
          setError("Email is already in use. Please use a different email.");
        } else if (error.code === "auth/invalid-email") {
          setError("Email is missing.");
        } else if (error.code === "auth/missing-password") {
          setError("Password is missing.")
        } else if (error.code === "auth/weak-password") {
          setError("Password should be at least 6 characters.");
        } else {
          setError("An error occurred. Please try again later.");
        }
      });
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit} noValidate>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;