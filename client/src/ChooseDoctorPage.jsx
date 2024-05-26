import React from 'react';
import { Link } from 'react-router-dom';
import './ChooseDoctorPage.css';

const ChooseDoctorPage = () => {
  return (
    <div className="choose-doctor-container">
      <h1>Wybierz lekarza</h1>
      <div className="buttons-container">
        <Link to="/calendar/dentysta" className="doctor-button">Dentysta</Link>
        <Link to="/calendar/okulista" className="doctor-button">Okulista</Link>
        <Link to="/calendar/pediatra" className="doctor-button">Pediatra</Link>
      </div>
    </div>
  );
};

export default ChooseDoctorPage;

