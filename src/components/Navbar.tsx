import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Import Firebase auth
import { signOut } from "firebase/auth";
import styles from "./Navbar.module.css"; // Import the styles

const Navbar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState<any>(null); // Track user authentication status
  const location = useLocation(); // Get the current route
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsActive(!isActive); // Toggle the active class on small screens
  };

  useEffect(() => {
    if (location.pathname === "/") {
      signOut(auth)
        .catch((error) => console.error("Error signing out:", error));
    }

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update user state on auth change
    });

    return unsubscribe; // Cleanup the subscription when the component unmounts
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to the home page after sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Check if current route is signup or signin
  const isAuthPage = location.pathname === "/signup" || location.pathname === "/signin";

  return (
    <nav className={`${styles.navbar} ${isActive ? styles.active : ""}`}>
      <span className={styles.logo}>RecipeVerse</span>

      {/* Conditionally render links based on the current page */}
      {!isAuthPage && (
        <ul>
          {user && (
            <>
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/" onClick={handleSignOut}>Sign Out</Link>
              </li>
            </>
          )}
        </ul>
      )}

      {/* Hamburger menu for mobile */}
      <div className={styles["menu-toggle"]} onClick={toggleMenu}>
        &#9776;
      </div>
    </nav>
  );
};

export default Navbar;
