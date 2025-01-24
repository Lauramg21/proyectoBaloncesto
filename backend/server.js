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

//---------SECCIONES----------

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

// Endpoint para obtener una sección por id
app.get('/api/secciones/:id', (req, res) => {
  const sectionId = req.params.id;
  pool.query('SELECT * FROM Secciones WHERE Id = ?', [sectionId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Sección no encontrada' });
    }

    res.json(results[0]); // Devolvemos el primer (y único) resultado
  });
});

// Endpoint para eliminar una sección
app.delete('/api/secciones/:id', (req, res) => {
  const id = req.params.id;

  pool.query('DELETE FROM Secciones WHERE Id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Sección eliminada exitosamente' });
  });
});



// Middleware para procesar JSON
app.use(express.json());

// Endpoint para crear una nueva sección
app.post('/api/secciones', (req, res) => {
  const { nombre } = req.body; // Recibe el nombre de la sección desde el frontend

  if (!nombre) {
    res.status(400).json({ error: 'El nombre de la sección es obligatorio' });
    return;
  }

  pool.query('INSERT INTO Secciones (Seccion) VALUES (?)', [nombre], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Devuelve la nueva sección creada con su ID generado
    const nuevaSeccion = { id: results.insertId, nombre };
    res.status(201).json(nuevaSeccion);
  });
});

// Endpoint para editar una sección
app.put('/api/secciones/:id', (req, res) => {
  const id = req.params.id; // Obtener el ID de la sección a editar
  const { nombre } = req.body; // Obtener el nuevo nombre de la sección desde el cuerpo de la solicitud

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la sección es obligatorio' });
  }

  // Ejecutar la consulta para actualizar la sección en la base de datos
  pool.query('UPDATE Secciones SET Seccion = ? WHERE Id = ?', [nombre, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Sección no encontrada' });
    }

    // Si todo sale bien, devolver la sección actualizada
    res.json({ id, nombre });
  });
});

//---------EQUIPOS------------

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

// Endpoint para crear un equipo nuevo
app.post('/api/equipos', (req, res) => {
  const { nombre, seccionId } = req.body; // Recibe el nombre del equipo y el sectionId desde el frontend

  if (!nombre) {
    res.status(400).json({ error: 'El nombre del equipo es obligatorio' });
    return;
  }

  if (!seccionId) {
    res.status(400).json({ error: 'El ID de la sección es obligatorio' });
    return;
  }

  // Insertar el equipo y asociarlo con la sección
  pool.query('INSERT INTO Equipos (Equipo, IdSeccion) VALUES (?, ?)', [nombre, seccionId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nuevoEquipoId = results.insertId;

    // Devolver los datos del equipo creado, incluyendo el nombre de la sección
    pool.query('SELECT Seccion FROM Secciones WHERE Id = ?', [seccionId], (err, sectionResults) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (sectionResults.length === 0) {
        res.status(404).json({ error: 'Sección no encontrada' });
        return;
      }

      const nombreSeccion = sectionResults[0].Seccion;

      const nuevoEquipo = {
        id: nuevoEquipoId,
        nombre, // Nombre del equipo
        nombreSeccion, // Nombre de la sección
      };

      res.status(201).json(nuevoEquipo);
    });
  });
});

// Endpoint para eliminar un equipo
app.delete('/api/equipos/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM Equipos WHERE Id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Equipo eliminada exitosamente' });
  });
});


// Endpoint para editar un equipo
app.put('/api/equipos/:id', (req, res) => {
  const id = req.params.id; // Obtener el ID del equipo a editar
  const { nombre, IdSeccion } = req.body; // Obtener nombre y IdSeccion desde el cuerpo de la solicitud

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del equipo es obligatorio' });
  }

  // Ejecutar la consulta para actualizar el equipo en la base de datos
  pool.query('UPDATE Equipos SET Equipo = ? WHERE Id = ?', [nombre, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    // Si todo sale bien, devolver el equipo actualizado
    res.json({ id, nombre, IdSeccion });
  });
});


//-----------JUGADORES------------------

// Endpoint para obtener los equipos de una sección
app.get('/api/jugadores/:id', (req, res) => {
  const equipoId = req.params.id;

  pool.query('SELECT * FROM Jugadores WHERE IdEquipo = ?', [equipoId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});


// Endpoint para obtener un equipo por id
app.get('/api/equiposJugador/:id', (req, res) => {
  console.log("hola");
  const id = req.params.id;
  console.log("EQUIPO ID: " + id)

  pool.query('SELECT * FROM Equipos WHERE Id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    res.json(results[0]); // Devolvemos solo el primer resultado
  });
});

// Endpoint para crear un jugador nuevo
app.post('/api/jugadores', (req, res) => {
  const { nombre, numero, equipoId } = req.body; 

  if (!nombre || !numero) {
    res.status(400).json({ error: 'El nombre y numero del jugador es obligatorio' });
    return;
  }

  if (!equipoId) {
    res.status(400).json({ error: 'El ID de la sección es obligatorio' });
    return;
  }

  // Insertar el equipo y asociarlo con la sección
  pool.query('INSERT INTO Jugadores (Jugador, Número, IdEquipo) VALUES (?, ?, ?)', [nombre, numero, equipoId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nuevoJugadorId = results.insertId;

    // Devolver los datos del equipo creado, incluyendo el nombre de la sección
    pool.query('SELECT Equipo FROM Equipos WHERE Id = ?', [equipoId], (err, equipoResults) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (equipoResults.length === 0) {
        res.status(404).json({ error: 'Equipo no encontrada' });
        return;
      }

      const nombreEquipo = equipoResults[0].Equipo;

      const nuevoJugador = {
        id: nuevoJugadorId,
        nombre,
        numero, // Nombre del equipo
        nombreEquipo, // Nombre de la sección
      };

      res.status(201).json(nuevoJugador);
    });
  });
});


// Endpoint para eliminar un equipo
app.delete('/api/jugadores/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM Jugadores WHERE Id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Equipo eliminada exitosamente' });
  });
});

// Endpoint para editar un jugador
app.put('/api/jugadores/:id', (req, res) => {
  const id = req.params.id; // Obtener el ID del equipo a editar
  const { nombre,numero, equipoId } = req.body; // Obtener nombre y IdSeccion desde el cuerpo de la solicitud
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del equipo es obligatorio' });
  }

  // Ejecutar la consulta para actualizar el equipo en la base de datos
  pool.query('UPDATE Jugadores SET Jugador = ?, Número = ? WHERE Id = ?', [nombre, numero, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    console.log(id, nombre, numero, equipoId
    )
    // Si todo sale bien, devolver el equipo actualizado
    res.json({ id, nombre, numero,equipoId });
  });
});