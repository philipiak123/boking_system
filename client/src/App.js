import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios'; // Dodajemy axios do wykonywania żądań
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
import DoctorCalendar from './DoctorCalendar';
import DetailsVisit from './DetailsVisit';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sprawdzamy, czy użytkownik jest zalogowany poprzez zapytanie do /check-user
        axios.get('http://localhost:5000/check-user', { withCredentials: true })
            .then(response => {
                if (response.data) {
                    setLoggedIn(true);
                    setUserData(response.data); // Przypisanie danych użytkownika z odpowiedzi sesji
                } else {
                    setLoggedIn(false);
                    setUserData(null);
                }
            })
            .catch(error => {
                console.log("Nie zalogowano:", error);
                setLoggedIn(false);
                setUserData(null);
            })
            .finally(() => {
                setLoading(false); // Ustawienie stanu ładowania na false, gdy odpowiedź zostanie odebrana
            });
    }, []);

    const handleLogin = (userData) => {
        setUserData(userData);  // Dane użytkownika pochodzą z sesji, więc localStorage nie jest potrzebne
        setLoggedIn(true);
    };

    const handleLogout = () => {
        axios.post('http://localhost:5000/logout', {}, { withCredentials: true })
            .then(() => {
                setLoggedIn(false);
                setUserData(null); // Dane użytkownika usuwane po wylogowaniu
            })
            .catch(err => console.error('Błąd podczas wylogowywania:', err));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const userType = userData?.typ || ""; // Pobieramy typ użytkownika z danych sesji

    return (
        <Router>
            <Menu loggedIn={loggedIn} handleLogout={handleLogout} userType={userType} />
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
                    <Route path="/doctor-visits/:day" element={loggedIn && userData?.typ !== "pacjent" ? <DoctorVisits userData={userData} /> : <Navigate to="/" />} />
                    <Route path="/edit-visit" element={loggedIn && userData?.typ !== "pacjent" ? <EditVisitPage /> : <Navigate to="/" />} />
                    <Route path="/doctor-calendar" element={loggedIn && userData?.typ !== "pacjent" ? <DoctorCalendar /> : <Navigate to="/" />} />
                    <Route path="/visit-details" element={<DetailsVisit />} />
                    <Route path="*" element={loggedIn ? <Navigate to="/" /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
