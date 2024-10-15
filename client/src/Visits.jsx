import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './Visits.css';

const Visits = ({ userData }) => {
  const [plannedVisits, setPlannedVisits] = useState([]);
  const [completedVisits, setCompletedVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        if (userData) {
          const response = await axios.get(`http://localhost:5000/api/visits/${userData.email}`);
          const formattedVisits = response.data.map(visit => ({
            ...visit,
            date: moment(visit.date).format('YYYY-MM-DD'),
            doctor: visit.doctor
          }));

          const now = new Date();
          const planned = [];
          const completed = [];

          formattedVisits.forEach(visit => {
            const visitDate = new Date(visit.date);
            if (visitDate > now) {
              planned.push(visit);
            } else {
              completed.push(visit);
            }
          });

          setPlannedVisits(planned);
          setCompletedVisits(completed);
        } else {
          setPlannedVisits([]);
          setCompletedVisits([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching visits:', error);
        setLoading(false);
      }
    };

    fetchVisits();
  }, [userData]);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="visits-container">
      {plannedVisits.length > 0 && (
        <div className="planned-visits">
          <h2>Planowane Wizyty</h2>
          <table className="visits-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Godzina</th>
                <th>Lekarz</th>
                <th>Opis</th> {/* Dodajemy kolumnę dla opisu */}
              </tr>
            </thead>
            <tbody>
{plannedVisits.map((visit, index) => (
  <tr key={index}>
    <td>{visit.date}</td>
    <td>{visit.time}</td>
    <td>{visit.lekarz}</td>
    <td className="description-cell">{visit.opis}</td>
  </tr>
))}



            </tbody>
          </table>
        </div>
      )}
      {completedVisits.length > 0 && (
        <div className="completed-visits">
          <h2>Odbyte Wizyty</h2>
          <table className="visits-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Godzina</th>
                <th>Lekarz</th>
                <th>Opis</th> {/* Dodajemy kolumnę dla opisu */}
              </tr>
            </thead>
            <tbody>
{completedVisits.map((visit, index) => (
  <tr key={index}>
    <td>{visit.date}</td>
    <td>{visit.time}</td>
    <td>{visit.lekarz}</td>
    <td className="description-cell">{visit.opis}</td> {/* Dodaj klasę description-cell */}
  </tr>
))}

            </tbody>
          </table>
        </div>
      )}
      {(plannedVisits.length === 0 && completedVisits.length === 0) && <p>Brak wizyt</p>}
    </div>
  );
};

export default Visits;
