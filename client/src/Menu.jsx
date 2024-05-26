import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Menu.css';

const Menu = ({ loggedIn, handleLogout, userType }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    loggedIn && (
      <div className="menu">
        <ul className="menu-links">
          <li className="menu-link"><Link to="/">Strona główna</Link></li>
          {userType !== "pacjent" && <li className="menu-link"><Link to="/doctor-calendar">Kalendarz lekarza</Link></li>}
          {userType === "pacjent" && <li className="menu-link"><Link to="/wybierz-lekarza">Zarezerwuj wizytę</Link></li>}
          <li className="menu-link"><Link to="/profile">Profil</Link></li>
          {userType === "pacjent" && <li className="menu-link"><Link to="/visits">Moje wizyty</Link></li>}
          <li className="menu-link"><Link to="/login" onClick={handleLogoutClick}>Wyloguj</Link></li>
        </ul>
      </div>
    )
  );
};

export default Menu;
