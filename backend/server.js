const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

// Configurar CORS para que Angular pueda acceder
app.use(cors());

// Crear conexión a la base de datos MariaDB
const pool = mysql.createPool({
  host: '82.223.102.153',
  user: '2DAMClubBaloncesto',
  password: '2DAMClubBaloncesto9876', // Usa la contraseña de tu base de datos
  database: '2DAMClubBaloncesto'
});

// Endpoint para obtener las secciones
app.get('/api/secciones', (req, res) => {
  pool.query('SELECT * FROM Secciones', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});