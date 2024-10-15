import React from 'react';
import { Link } from 'react-router-dom';

const Profile = ({ userData }) => {
  return (
    <div>
      <h2>Twój profil</h2>
      {userData && (
        <div>
          <p>Email: {userData.email}</p>
          <p><Link to="/changepassword">Zmień hasło</Link></p>
        </div>
      )}
    </div>
  );
};

export default Profile;
