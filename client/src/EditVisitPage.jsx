import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './EditVisitPage.css'; // Importujemy styl CSS dla komponentu

const EditVisitPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');

  useEffect(() => {
    if (location.state && typeof location.state.visitId === 'number') {
      setDescription('');
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleSubmit = async () => {
    try {
      const visitId = location.state.visitId;
      await axios.put(`http://localhost:5000/api/edit-visit/${visitId}`, { description });
      navigate('/doctor-visits');
    } catch (error) {
      console.error('Error updating visit description:', error);
    }
  };

  return (
    <div className="edit-visit-container">
      <h1 className="edit-visit-title">Edytuj wizytę</h1>
      <div className="edit-visit-textarea-container">
        <textarea
          className="edit-visit-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="10" // Ustawiamy liczbę widocznych wierszy
          readOnly={false} // Ustawiamy readOnly na false, aby użytkownik mógł edytować tekst
        ></textarea>
      </div>
      <div className="edit-visit-button-container">
        <button className="edit-visit-button" onClick={handleSubmit}>Zapisz opis wizyty</button>
      </div>
    </div>
  );
};

export default EditVisitPage;
