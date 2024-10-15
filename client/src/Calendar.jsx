import React, { useState, useEffect } from 'react';
import './Calendar.css';
import moment from 'moment';
import { Navigate, useNavigate, useParams } from 'react-router-dom'; // Import Navigate and useParams

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [columnDate, setColumnDate] = useState("");
  const [selectedDay, setSelectedDay] = useState(null); // State to store selected day
  const { lekarz } = useParams(); // Get the value of lekarz from URL
  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    // Usunięto zbędne wywołanie do API /api/calendar
    const formattedDays = []; // Dummy data to simulate calendar days
    setCalendarDays(formattedDays); // Set dummy data
    if (formattedDays.length > 0) {
      setColumnDate(moment(formattedDays[0]).format('YYYY-MM-DD')); // Set columnDate from the first day
    }
  }, []);

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
      const isDayInDatabase = calendarDays.includes(currentDay);
      const isFutureDay = currentDay > today;
      const isSunday = new Date(year, currentDate.getMonth(), i).getDay() === 0; // Sprawdzenie, czy dzień to niedziela

      currentWeek.push(
        <td key={`day-${i}`} className={`calendar-day}`}>
          {isSunday ? ( // Dodanie warunku sprawdzającego, czy dzień to niedziela
            i
          ) : (
            isFutureDay ? (
              <button onClick={() => handleDayButtonClick(currentDay)}>{i}</button>
            ) : (
              i
            )
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

  // Check if selected day is not null and lekarz is not dentysta, pediatra, or okulista
  if (lekarz !== "dentysta" && lekarz !== "pediatra" && lekarz !== "okulista") {
    return <Navigate to="/" />; // Przejdź na stronę główną, jeśli lekarz nie jest prawidłowy
  }

  // Render HourPicker component if selectedDay is not null
  if (selectedDay) {
    return <Navigate to={`/hourpicker/${selectedDay}/${lekarz}`} replace />; {/* Przekierowanie do /hourpicker z wybranym dniem i lekarzem */}
  }

  return (
    <div>
      <h1>{columnDate}</h1>
      <div className="calendar-container">
        <button onClick={prevMonth}>Previous Month</button>
        <h2>{`${month} ${year}`}</h2>
        <button onClick={nextMonth}>Next Month</button>
        <table className="calendar-table">
          <tbody>{generateDaysInMonth()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
