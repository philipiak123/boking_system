import React from 'react';

const DetailsVisit = ({ visit }) => {
  return (
    <div>
      <h2>Szczegóły wizyty</h2>
      <p>Data: {visit.date}</p>
      <p>Godzina: {visit.time}</p>
      <p>Lekarz: {visit.lekarz}</p>
      <p>Opis: {visit.opis}</p>
    </div>
  );
};

export default DetailsVisit;
