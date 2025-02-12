import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Correct import for Firebase auth

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    setError("Both email and password are required.");
    return;
  }

  try {
    // Attempt to sign in with Firebase
    setError(""); // Clear any previous errors
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user);

    navigate("/home"); // Redirect to home or any other page after successful sign-in
  } catch (error: any) {
    console.log(error.code)
    // Handle Firebase authentication errors with user-friendly messages
    switch (error.code) {
      case "auth/invalid-credential":
        setError("Incorrect email or password. Please try again.");
        break;
      default:
        setError("An error occurred. Please try again.");
        break;
    }
  }
};


  return (
    <div className={styles.signinContainer}>
      <div className={styles.signinBox}>
        <div className={styles.leftSection}>
          <div className={styles.leftContent}>
            <h1>Welcome to RecipeVerse!</h1>
            <p>Discover, create, and share amazing recipes with food lovers around the world!</p>
            <button 
              className={styles.signupButton}
              onClick={() => navigate("/signup")}
            >
              Start Cooking Today
            </button>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.formContainer}>
            <h2 className={styles.signinHeading}>Sign In</h2>
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
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputField}
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {error && <p className={styles.errorMessage}>{error}</p>}

              <button type="submit" className={styles.signinButton}>
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;