// ChangePassword.js
import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = ({ userData }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      if (newPassword.length < 8) {
        setMessage('Nowe hasło musi mieć przynajmniej 8 znaków.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage('Nowe hasło i potwierdzenie hasła nie są identyczne.');
        return;
      }
      const response = await axios.post('http://localhost:5000/changePassword', {
        userId: userData.id,
        oldPassword,
        newPassword
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Zmień hasło</h2>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Stare hasło:</label>
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
        </div>
        <div>
          <label>Nowe hasło:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        <div>
          <label>Potwierdź nowe hasło:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit">Zmień hasło</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePassword;
