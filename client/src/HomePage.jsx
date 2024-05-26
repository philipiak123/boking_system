// HomePage.js
import React from 'react';

const HomePage = ({ userData, handleLogout }) => {
  return (
    <div>
      {userData && (
        <div>
          <h1>Witamy na stronie głównej</h1>
        </div>
      )}
    </div>
  );
};

export default HomePage;
