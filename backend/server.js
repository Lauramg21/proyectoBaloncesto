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

// Endpoint para eliminar una sección
app.delete('/api/secciones/:id', (req, res) => {
  const id = req.params.id;

  pool.query('DELETE FROM Secciones WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Sección eliminada exitosamente' });
  });
});

// Endpoint para obtener los equipos de una sección
app.get('/api/equipos/:id', (req, res) => {
  const sectionId = req.params.id;

  pool.query('SELECT * FROM Equipos WHERE IdSeccion = ?', [sectionId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});