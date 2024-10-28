import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const db = firebase.firestore();
      const usersCollection = await db.collection('users').get();
      setUsers(usersCollection.docs.map(doc => doc.data()));
    };

    const checkAdmin = async () => {
      const user = firebase.auth().currentUser;
      if (user && user.email === 'mjsavage@gmail.com') {
        setAdmin(true);
      }
    };

    fetchUsers();
    checkAdmin();
  }, []);

  const handleDeleteUser = async (email) => {
    const db = firebase.firestore();
    await db.collection('users').doc(email).delete();
    setUsers(users.filter(user => user.email !== email));
  };

  return (
    <div>
      <h2>User Management</h2>
      {admin ? (
        <ul>
          {users.map(user => (
            <li key={user.email}>
              {user.name} ({user.email})
              <button onClick={() => handleDeleteUser(user.email)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You do not have permission to manage users.</p>
      )}
    </div>
  );
};

export default UserManagement;
