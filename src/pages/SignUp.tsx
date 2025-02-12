import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css"; // Assuming the stylesheet is named SignUp.module.css
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Import Firebase auth

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      // Attempt to create a user with Firebase
      setError(""); // Clear any previous errors
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered:", userCredential.user);
  
      navigate("/home"); // Redirect on success
    } catch (error: any) {
      // Handle Firebase authentication errors with user-friendly messages
      console.log(error.code);
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("This email is already in use. Please try another one.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          setError("Please enter a password with at least six characters")
          break;
        case "auth/missing-email":
          setError("Email is required.");
          break;
        default:
          setError("An error occurred. Please try again.");
          break;
      }
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.signupHeading}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              placeholder="Enter your password"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.inputField}
              placeholder="Confirm your password"
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <button type="submit" className={styles.signupButton}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
