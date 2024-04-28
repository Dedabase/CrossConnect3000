// Import necessary functions from the Firebase Authentication API
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Import the auth instance configured in the firebaseConfig module
import { auth } from "../firebaseConfig";

// Function to log in a user using their email and password
export const LoginAPI = (email, password) => {
  try {
    // Attempt to sign in the user with the provided credentials
    let response = signInWithEmailAndPassword(auth, email, password);
    // Return the promise containing the authentication result
    return response;
  } catch (err) {
    // Return the error if sign in fails
    return err;
  }
};

// Function to register a new user with an email and password
export const RegisterAPI = (email, password) => {
  try {
    // Attempt to create a new user with the provided credentials
    let response = createUserWithEmailAndPassword(auth, email, password);
    // Return the promise containing the registration result
    return response;
  } catch (err) {
    // Return the error if registration fails
    return err;
  }
};

// Function to handle sign in through Google
export const GoogleSignInAPI = () => {
  try {
    // Create a new Google Auth provider
    let googleProvider = new GoogleAuthProvider();
    // Attempt to sign in using a popup window and the Google provider
    let res = signInWithPopup(auth, googleProvider);
    // Return the promise containing the authentication result
    return res;
  } catch (err) {
    // Return the error if Google sign-in fails
    return err;
  }
};

// Function to log out the current user
export const onLogout = () => {
  try {
    // Attempt to sign out the current user
    signOut(auth);
  } catch (err) {
    // Return the error if logout fails
    return err;
  }
};
