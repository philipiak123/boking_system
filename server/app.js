// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Importowanie pakietu cors
const session = require('express-session'); // Importowanie express-session


const app = express();
const port = 5000;



const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Ustaw swoje hasło
  database: 'calendar'
});

app.use(bodyParser.json());

// Użyj pakietu cors z obsługą credentials
app.use(cors({
  origin: 'http://localhost:3000',  // Adres aplikacji React
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],  // Dozwolone metody
  credentials: true  // Ważne! Pozwala na przesyłanie ciasteczek i sesji
}));

// Konfiguracja sesji
app.use(session({
  secret: 'your_secret_key',  // Zmień na bardziej złożony klucz
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,  // Ustaw na true, jeśli używasz HTTPS
    httpOnly: true, // Chroni ciasteczka przed dostępem przez JS
    sameSite: 'lax' // Kontrola dla żądań cross-site
  }
}));


app.use(session({
  secret: 'your_secret_key', // Zmień na bardziej złożony klucz
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Ustaw na true, jeśli używasz HTTPS
}));

app.post('/login', (req, res) => {
  const { email, password } = req.body;
console.log('Logowanie');
  db.query('SELECT * FROM uzytkownicy WHERE email = ?', [email], async (err, result) => {
    if (err) {
		console.log(err);
      res.status(500).json({ error: 'Błąd serwera' });
    } else if (result.length === 0) {
      res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    } else {
      const user = result[0];
      try {
        if (await bcrypt.compare(password, user.pass)) {
          // Ustawienie sesji
          req.session.user = { id: user.id, email: user.email, typ: user.typ };
          res.json({ 
            message: 'Zalogowano pomyślnie',
            user: req.session.user // Przesyłanie danych użytkownika z sesji
          });
        } else {
          res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Błąd serwera' });
      }
    }
  });
});

// Dodajemy endpoint do wylogowania
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Błąd serwera' });
    }
    res.json({ message: 'Zostałeś pomyślnie wylogowany' });
  });
});

// Dodajemy endpoint do sprawdzenia użytkownika
app.get('/check-user', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: 'Użytkownik niezalogowany' });
  }
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Sprawdzamy czy hasło ma przynajmniej 8 znaków
  if (password.length < 8) {
    res.status(400).json({ error: 'Hasło musi zawierać przynajmniej 8 znaków.' });
    return;
  }

  // Sprawdzamy czy użytkownik o podanym emailu już istnieje w bazie danych
  const query = 'SELECT * FROM uzytkownicy WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Błąd zapytania do bazy danych:', err);
      res.status(500).json({ error: 'Błąd serwera. Spróbuj ponownie później.' });
      return;
    }
    if (results.length > 0) {
      res.status(400).json({ error: 'Użytkownik o podanym adresie email już istnieje.' });
      return;
    }

    // Haszowanie hasła przed zapisaniem do bazy danych
    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error('Błąd hashowania hasła:', hashErr);
        res.status(500).json({ error: 'Błąd serwera. Spróbuj ponownie później.' });
        return;
      }

      // Zapisanie nowego użytkownika do bazy danych z dodanym typem 'pacjent'
      const insertQuery = 'INSERT INTO uzytkownicy (email, pass, typ) VALUES (?, ?, ?)';
      const typ = 'pacjent';
      db.query(insertQuery, [email, hashedPassword, typ], (insertErr) => {
        if (insertErr) {
          console.error('Błąd zapisu nowego użytkownika do bazy danych:', insertErr);
          res.status(500).json({ error: 'Błąd serwera. Spróbuj ponownie później.' });
          return;
        }
        res.status(201).json({ message: 'Użytkownik został pomyślnie zarejestrowany.' });
      });
    });
  });
});


app.get('/api/busy-hours/:day/:lekarz', (req, res) => {
  const { day, lekarz } = req.params;
  console.log(day, lekarz);
  const query = 'SELECT time FROM dates WHERE date = ? AND lekarz = ?';

  db.query(query, [day, lekarz], (err, results) => {
    if (err) {
      console.error('Error fetching busy hours from MySQL:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }

    const busyHours = results.map(result => result.time);
    res.json(busyHours);
    console.log(busyHours);
  });
});

app.put('/api/edit-visit/:visitId', (req, res) => {
  const visitId = req.params.visitId;
  const { description } = req.body;

  const query = 'UPDATE dates SET opis = ? WHERE id = ?'; // Zapytanie SQL do aktualizacji opisu wizyty

  db.query(query, [description, visitId], (err, results) => {
    if (err) {
      console.error('Error updating visit description in MySQL:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    console.log('Visit description updated successfully.');
    res.json({ message: 'Visit description updated successfully.' });
  });
});


app.get('/api/doctor-visits/:lekarz', (req, res) => {
  const { lekarz } = req.params; // Odbieramy parametr lekarza z żądania
  const { day } = req.query; // Odbieramy dzień z parametrów zapytania

  // Zapytanie SQL do pobrania danych wizyt lekarskich dla danego lekarza i dnia
  const query = 'SELECT * FROM dates WHERE lekarz = ? AND date = ?';

  // Wykonujemy zapytanie do bazy danych
  db.query(query, [lekarz, day], (err, results) => {
    if (err) {
      console.error('Error fetching doctor visits from MySQL:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }

    // Jeśli wyniki są dostępne, wysyłamy je jako odpowiedź
    res.json(results);
  });
});


// Importujemy moduł moment do formatowania daty
const moment = require('moment');

app.get('/api/visits/:userEmail', (req, res) => {
  const userEmail = req.params.userEmail;

  // Zapytanie SQL do pobrania wizyt dla danego użytkownika na podstawie adresu e-mail, posortowane wg daty i godziny
  const sql = 'SELECT * FROM dates WHERE email = ? ORDER BY DATE(date), TIME(time)';

  // Wykonaj zapytanie do bazy danych
  db.query(sql, [userEmail], (err, results) => {
    if (err) {
      console.error('Error fetching visits from the database:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    console.log('Visits fetched successfully:', results);
    res.json(results); // Zwróć wizyty jako odpowiedź z serwera
  });
});


app.post('/api/selected-hour/:day/:hour/:email/:lekarz', (req, res) => {
  const { day, hour, email, lekarz } = req.params; // Odbierz parametry z URL
  console.log(day, hour, email, lekarz);
  
  const query = 'INSERT INTO dates (date, time, email, lekarz) VALUES (?, ?, ?, ?)'; // Zmodyfikowane zapytanie SQL

  db.query(query, [day, hour, email, lekarz], (err, results) => {
    if (err) {
      console.error('Error saving selected hour to MySQL:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    console.log('Selected hour saved successfully.');
    res.json({ message: 'Selected hour saved successfully.' });
  });
});


app.post('/changepassword', (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  // Pobierz hasło użytkownika z bazy danych na podstawie userId
  const query = 'SELECT pass FROM uzytkownicy WHERE id = ?'; // Zmieniono na nazwę kolumny
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Błąd zapytania do bazy danych:', err);
      res.status(500).json({ error: 'Błąd serwera. Spróbuj ponownie później.' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Użytkownik nie istnieje.' });
      return;
    }

    const user = results[0];

    // Sprawdź czy stare hasło jest poprawne
    bcrypt.compare(oldPassword, user.pass, (compareErr, isMatch) => {
      if (compareErr) {
        console.error('Błąd porównania hasła:', compareErr);
        res.status(500).json({ error: 'Błąd serwera. Spróbuj ponownie później.' });
        return;
      }
      if (!isMatch) {
        res.status(401).json({ error: 'Podane stare hasło jest niepoprawne.' });
        return;
      }

      // Zahaszuj nowe hasło
      bcrypt.hash(newPassword, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error('Błąd hashowania hasła:', hashErr);
          res.status(500).json({ error: 'Błąd serwera. Spróbuj ponownie później.' });
          return;
        }

        // Aktualizuj hasło użytkownika w bazie danych
        const updateQuery = 'UPDATE uzytkownicy SET pass = ? WHERE id = ?'; // Zmieniono na nazwę kolumny
        db.query(updateQuery, [hashedPassword, userId], (updateErr) => {
          if (updateErr) {
            console.error('Błąd aktualizacji hasła w bazie danych:', updateErr);
            res.status(500).json({ error: 'Błąd serwera. Spróbuj ponownie później.' });
            return;
          }
          res.status(200).json({ message: 'Hasło zostało pomyślnie zmienione.' });
        });
      });
    });
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
