import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom'; // Importujemy hook useNavigate i useParams

const DoctorVisits = ({ userData }) => {
  const [doctorVisits, setDoctorVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Inicjalizujemy hook useNavigate
  const { day } = useParams(); // Wyodrębniamy datę wizyty z adresu URL

  useEffect(() => {
    const fetchDoctorVisits = async () => {
      try {
        if (userData && userData.typ !== "pacjent") {
          // Wysyłamy zapytanie HTTP z datą wizyty do serwera
          const response = await axios.get(`http://localhost:5000/api/doctor-visits/${userData.typ}?day=${day}`);
          setDoctorVisits(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctor visits:', error);
        setLoading(false);
      }
    };

    fetchDoctorVisits();
  }, [userData, day]); // Dodajemy day do zależności useEffect, aby reagować na zmiany daty wizyty

  const handleEditClick = (visitId) => {
    // Przekierowanie do /edit-visit z przekazaniem id wizyty w state
    navigate('/edit-visit', { state: { visitId } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Wizyty lekarskie</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Godzina</th>
            <th>Pacjent</th>
            <th>Edycja</th>
          </tr>
        </thead>
        <tbody>
          {doctorVisits.map((visit, index) => (
            <tr key={index}>
              <td>{moment(visit.date).format('YYYY-MM-DD')}</td>
              <td>{visit.time}</td>
              <td>{visit.email}</td>
              <td>
                <button onClick={() => handleEditClick(visit.id)}>Edytuj</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorVisits;
