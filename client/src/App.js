import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import HomePage from './HomePage';
import ChangePassword from './ChangePassword';
import RegisterForm from './RegisterForm';
import Calendar from './Calendar';
import HourPicker from './HourPicker';
import Menu from './Menu';
import Profile from './Profile';
import Visits from './Visits';
import ChooseDoctorPage from './ChooseDoctorPage';
import DoctorVisits from './DoctorVisits';
import EditVisitPage from './EditVisitPage';
import DoctorCalendar from './DoctorCalendar'; // Importujemy komponent DoctorCalendar
import DetailsVisit from './DetailsVisit'; // Importujemy komponent DetailsVisit

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
      const user = JSON.parse(localStorage.getItem('user'));
      setUserData(user);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUserData(userData);
    setLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    setUserData(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  
  const userType = userData?.typ || ""; // Pobieramy typ użytkownika

  return (
    <Router>
      <Menu loggedIn={loggedIn} handleLogout={handleLogout} userType={userType} /> {/* Przekazujemy userType do Menu */}
      <div>
        <Routes>
          <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <LoginForm handleLogin={handleLogin} />} />
          <Route path="/register" element={!loggedIn ? <RegisterForm /> : <Navigate to="/" />} />
          <Route path="/changepassword" element={loggedIn ? <ChangePassword userData={userData} /> : <Navigate to="/login" />} />
          <Route path="/" element={loggedIn ? <HomePage userData={userData} handleLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/calendar/:lekarz" element={loggedIn ? <Calendar userData={userData} /> : <Navigate to="/login" />} />
          <Route path="/hourpicker/:day/:lekarz" element={loggedIn ? <HourPicker userData={userData} /> : <Navigate to="/login" />} />
          <Route path="/visits" element={loggedIn ? <Visits userData={userData} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={loggedIn ? <Profile userData={userData} /> : <Navigate to="/login" />} />
          <Route path="/wybierz-lekarza" element={<ChooseDoctorPage />} />
          <Route path="/doctor-visits/:day" element={loggedIn && userData?.typ !== "pacjent" ? <DoctorVisits userData={userData} /> : <Navigate to="/" />} /> {/* Dodajemy dynamiczny parametr :day */}
          <Route path="/edit-visit" element={loggedIn && userData?.typ !== "pacjent" ? <EditVisitPage /> : <Navigate to="/" />} />
          <Route path="/doctor-calendar" element={loggedIn && userData?.typ !== "pacjent" ? <DoctorCalendar /> : <Navigate to="/" />} /> {/* Dodajemy trasę dla komponentu DoctorCalendar */}
          <Route path="/visit-details" element={<DetailsVisit />} /> {/* Dodajemy trasę do szczegółów wizyty */}
          <Route path="*" element={loggedIn ? <Navigate to="/" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
