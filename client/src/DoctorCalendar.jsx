import React, { useState } from 'react';
import moment from 'moment';
import { Navigate, useParams } from 'react-router-dom'; // Importujemy Navigate i useParams

const DoctorCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null); // State to store selected day
  const { lekarz } = useParams(); // Get the value of lekarz from URL

  const prevMonth = () => {
    setCurrentDate(prevDate => {
      const prevMonthDate = new Date(prevDate);
      prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
      return prevMonthDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate(prevDate => {
      const nextMonthDate = new Date(prevDate);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      return nextMonthDate;
    });
  };

  const handleDayButtonClick = (day) => {
    console.log('Button clicked for day:', day);
    setSelectedDay(day); // Set selected day
  };

  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const generateDaysInMonth = () => {
    const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(year, currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const today = moment().format('YYYY-MM-DD');

    const days = [];
    let currentWeek = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(<td key={`empty-${i}`} className="calendar-day"></td>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDay = moment(new Date(year, currentDate.getMonth(), i)).format('YYYY-MM-DD');
      const isSunday = new Date(year, currentDate.getMonth(), i).getDay() === 0; // Sprawdzenie, czy dzień to niedziela

      currentWeek.push(
        <td key={`day-${i}`} className={`calendar-day ${isSunday ? 'sunday' : ''}`}>
          {isSunday ? (
            i
          ) : (
            <button onClick={() => handleDayButtonClick(currentDay)}>{i}</button>
          )}
        </td>
      );

      if (currentWeek.length === 7 || i === daysInMonth) {
        days.push(<tr key={`week-${days.length}`}>{currentWeek}</tr>);
        currentWeek = [];
      }
    }

    return days;
  };

  // Render Navigate to /doctor-visits if selectedDay is not null
  if (selectedDay) {
    return <Navigate to={`/doctor-visits/${selectedDay}`} replace />; {/* Przekierowanie do /doctor-visits z wybranym dniem */}
  }

  return (
    <div>
      <h2>{`${month} ${year}`}</h2>
      <div className="calendar-container">
        <button onClick={prevMonth}>Previous Month</button>
        <table className="calendar-table">
          <thead>
            <tr>
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
            </tr>
          </thead>
          <tbody>{generateDaysInMonth()}</tbody>
        </table>
        <button onClick={nextMonth}>Next Month</button>
      </div>
    </div>
  );
};

export default DoctorCalendar;
