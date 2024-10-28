import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [otherDetails, setOtherDetails] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        setUser(user);
        const db = firebase.firestore();
        const userDoc = await db.collection('users').doc(user.email).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setName(userData.name);
          setAddress(userData.address);
          setOtherDetails(userData.otherDetails);
        }
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    if (user) {
      const db = firebase.firestore();
      await db.collection('users').doc(user.email).set({
        name,
        address,
        otherDetails
      });
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Address:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div>
        <label>Other Details:</label>
        <input
          type="text"
          value={otherDetails}
          onChange={(e) => setOtherDetails(e.target.value)}
        />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Profile;
