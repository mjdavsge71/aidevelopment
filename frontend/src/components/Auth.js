import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const handleGoogleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      setUser(result.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      const result = await firebase.auth().signInWithEmailAndPassword(email, password);
      setUser(result.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailSignUp = async () => {
    try {
      const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
      setUser(result.user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Authentication</h2>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleEmailSignIn}>Sign in with Email</button>
        <button onClick={handleEmailSignUp}>Sign up with Email</button>
      </div>
      {user && <div>Welcome, {user.email}</div>}
    </div>
  );
};

export default Auth;
