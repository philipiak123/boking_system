import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useParams, Link, Navigate } from 'react-router-dom';

const HourPicker = ({ userData }) => { // Przekazujemy userData jako props
  const { day, lekarz } = useParams();
  const [busyHours, setBusyHours] = useState([]);

useEffect(() => {
  fetch(`http://localhost:5000/api/busy-hours/${day}/${lekarz}`)
    .then(response => response.json())
    .then(data => setBusyHours(data))
    .catch(error => console.error('Error fetching busy hours:', error));
}, [day, lekarz]);

  
  const today = moment().format('YYYY-MM-DD');

  // Sprawdzanie, czy wartość 'day' jest datą
  const isValidDate = date => moment(date, 'YYYY-MM-DD', true).isValid();

  // Sprawdzanie, czy data jest dzisiejszą datą
  const isToday = date => date === today;

  // Sprawdzanie, czy data jest niedzielą
  const isSunday = date => moment(date).format('dddd') === 'Sunday';

  // Sprawdzanie, czy data jest datą przeszłą
  const isPastDate = date => moment(date).isBefore(today, 'day');

  // Jeśli 'day' nie jest prawidłową datą, dzisiejszą datą, niedzielą lub już minęła, przekieruj użytkownika na stronę główną
  if (!isValidDate(day) || isToday(day) || isSunday(day) || isPastDate(day)) {
    return <Navigate to="/calendar" />;
  }

  // Sprawdzanie, czy lekarz jest dentystą, pediatrą lub okulistą
  if (lekarz !== "dentysta" && lekarz !== "pediatra" && lekarz !== "okulista") {
    return <Navigate to="/" />; // Przejdź na stronę główną, jeśli lekarz nie jest prawidłowy
  }

  const handleHourClick = hour => {
  saveSelectedHour(day, hour, userData.email, lekarz); // Dodajemy wartość lekarza
};


  const formatHour = hour => {
    return moment.utc(hour, 'HH:mm').format('HH:mm');
  };

  const saveSelectedHour = (day, hour, email, lekarz) => {
  fetch(`http://localhost:5000/api/selected-hour/${day}/${hour}/${email}/${lekarz}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    window.location.reload();
  })
  .catch(error => console.error('Error saving selected hour:', error));
};


  const renderHourButtons = () => {
    const hours = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = moment.utc({ hour, minute }).format('HH:mm');
        let isHourBusy = false;

        for (const busyHour of busyHours) {
          if (formattedHour === formatHour(busyHour)) {
            isHourBusy = true;
            break;
          }
        }

        hours.push(
          <button
            key={formattedHour}
            onClick={() => handleHourClick(formattedHour)}
            style={{
              backgroundColor: isHourBusy ? 'red' : 'white',
              color: isHourBusy ? 'white' : 'black',
              margin: '5px 0',
              padding: '10px',
              width: '200px',
              fontSize: '1.2rem'
            }}
            disabled={isHourBusy}
          >
            {formattedHour}
          </button>
        );
      }
    }
    return hours;
  };

  return (
    <div className="hour-picker">
      <h4 style={{ fontSize: '1.5rem' }}>Wybrany dzień: {day}</h4>
      <div className="hour-buttons" style={{ display: 'flex', justifyContent: 'center', fontSize: '1.2rem' }}>
        {renderHourButtons()}
      </div>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default HourPicker;
