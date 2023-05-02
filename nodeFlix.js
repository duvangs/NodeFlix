const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSemilla = "dasda/&Ñ[¨P-.";

//base de datos
const {Sequelize, Model, DataTypes, and} = require('sequelize');

const sequelize = new Sequelize('pruebaBack', 'sa', 'prueba2023', {
    host: '127.0.0.1',
    port: 1433,
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: true,
            //enableArithAbort: true,
        }
    }
});

sequelize.sync({force:false}).then(() => {
    console.log('Modelo sincronizado con la base de datos');
}).catch(err => {
    console.error('Error al sincronizar el modelo con la base de datos:', err);
});


const Catalogo = sequelize.define('repertorio', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genero: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    noVisualizaciones: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    puntaje: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('GETDATE()')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    freezeTableName: true // Evita que Sequelize agregue una "s" al final del nombre del modelo al definir el nombre de la tabla
  });

  const Usuarios = sequelize.define('usuarios', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('GETDATE()')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('GETDATE()')
    }
  },{
    freezeTableName: true // Evita que Sequelize agregue una "s" al final del nombre del modelo al definir el nombre de la tabla
  });

  const HistorialVisualizacion = sequelize.define('historialVisualizacion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fechaVisualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    puntuarPelicula: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      },
    idRepertorio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Catalogo',
        key: 'id',
      },
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
    }},
    {
        timestamps: false, // Evita la creación automática de createdAt y updatedAt
        freezeTableName: true // Evita que Sequelize agregue una "s" al final del nombre del modelo al definir el nombre de la tabla
  });
  
  
  
const app = express();
app.use(cors());
app.use(bodyParser.json());

//obtener una pelicula o serie aleatoria
app.get('/apiV1/NodeFlix/catalogo/peliculaAleatoria', async(req,res) => {
    
    try{
        const peliculaAleatoria = await Catalogo.findOne({
            attributes: ['id','nombre','genero','tipo','noVisualizaciones','puntaje'],
            order: sequelize.literal('NEWID()'),
            limit : 1,
            tableHint: 'TABLESAMPLE(1 ROWS)',
        });

        if(!peliculaAleatoria){
            return res.status(404).json({error: 'No se encontró ningún registro de película'});
        }

        res.status(200).json(peliculaAleatoria);
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'ocurrio un error al obtener la película'})
    }
    
});

//obtener todas las peliculas o series ordendas por (Nombre, tipo, genero o puntaje)
app.get('/apiV1/NodeFlix/catalogo/ordenarPeliculas', async(req, res) =>{
    
const {nombre, genero, tipo, puntaje } = req.body;
  let order = [];

  if (nombre) {
    order.push(['nombre', nombre]);
  }

  if (tipo) {
    order.push(['tipo', tipo]);
  }

  if (genero) {
    order.push(['genero', genero]);
  }

  if (puntaje) {
    order.push(['puntaje', puntaje]);
  }

  try {
    const registrosOrdenados = await Catalogo.findAll({
      order,
    });

    if (!registrosOrdenados.length) {
      return res.status(404).json({ error: 'No se encontraron registros en el catálogo' });
    }

    res.json(registrosOrdenados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los registros del catálogo' });
  }
});

//Filtros por nombre, tipo o género
app.post('/apiV1/NodeFlix/catalogo/peliculasFiltro', async(req,res) =>{
    try {
        
        const { nombre, tipo, genero } = req.body;
        console.log(req.body)
        let where = {};
    
        if (nombre) {
          where.nombre = nombre;
        }
    
        if (tipo) {
          where.tipo = tipo;
        }
    
        if (genero) {
          where.genero = genero;
        }
    
        const catalogo = await Catalogo.findAll({
          where: where
        });
    
        res.status(200).json(catalogo);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el catálogo.' });
      }
    });

app.post('/apiV1/NodeFlix/usuarios/vistos/:Id', async (req, res) => {
        
        const idRepertorio = Number(req.params.Id);
        const token = req.headers.authorization.split(" ")[1];
       
        try {
            let decoded = jwt.verify(token, jwtSemilla); 
            const idUsuario = decoded.id;
            console.log(decoded.id); 

          // Buscar si el usuario ya ha visto la película o serie
          const vistaExistente = await HistorialVisualizacion.findOne({ 
            attributes: ['idRepertorio', 'idUsuario'],
            where: { idUsuario, idRepertorio },
            raw: true,
            //include: { model: Catalogo }
        });
            
          
          if (vistaExistente) {
            console.log(vistaExistente);
            // El usuario ya ha visto la película o serie previamente
            return res.status(400).send({ mensaje: 'El usuario ya ha visto esta película o serie' });
          } else {
            // Crear un nuevo registro en la tabla de vistos
            const nuevaVista = await HistorialVisualizacion.create({
                idUsuario ,
                idRepertorio,

              }, { 
                fields: ['idUsuario', 'idRepertorio'] 
              });
            return res.status(201).send({ mensaje: 'Contenido marcado como visto' });
          }
        } catch (error) {
          console.log(error);
          return res.status(500).send({ mensaje: 'Error al marcar como visto el repertorio' });
        }
      });
      

//Puntuar una pelicula o serie
app.put('/apiV1/NodeFlix/usuarios/repertorio/:id/puntaje', async (req, res) => {
    const { id } = req.params;
    const { puntaje } = req.body;
    const token = req.headers.authorization.split(" ")[1];
  
    try {
        let decoded = jwt.verify(token, jwtSemilla); 

        const estadoPuntaje = await HistorialVisualizacion.findOne({
        attributes: ['puntuarPelicula'],
        where: { idUsuario:decoded.id, idRepertorio:id },
        raw: true,
      });  

      console.log(estadoPuntaje);

      if(estadoPuntaje != null){
        if (estadoPuntaje.puntuarPelicula == false){
            // Obtener los valores actuales de "puntaje" y "noVisualizaciones"
            const item = await Catalogo.findByPk(id);
            const { puntaje: puntajeActual, noVisualizaciones } = item;
      
            // Calcular el nuevo puntaje promedio
            const nuevoPuntaje = ((puntajeActual * noVisualizaciones) + puntaje) / (noVisualizaciones + 1);
            console.log(puntajeActual);
            console.log(noVisualizaciones);
            console.log(puntaje);
            console.log(typeof(puntaje));
            console.log(nuevoPuntaje);
            // Actualizar la fila correspondiente en la tabla "repertorio"
            await Catalogo.update(
                { puntaje: nuevoPuntaje, noVisualizaciones: noVisualizaciones + 1 },
                { where: { id } }
            );
            await HistorialVisualizacion.update(
                {puntuarPelicula: true},
                {where: { idUsuario:decoded.id, idRepertorio:id }}
            );
            res.status(200).json({ message: 'Puntaje actualizado exitosamente' });
          }else{
            res.status(404).json({message: "El usuario ya ha puntuado la serie o pelicula"});
          }
      }else{
        res.status(404).json({message: "El usuario no ha visto la pelicula por lo tanto no la puede puntuar"});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el puntaje' });
    }
  });
  

app.post('/apiV1/NodeFlix/usuario/CrearUsuarios', async (req, res) => {
    const { nombre, email, contraseña } = req.body;
  
    // Generamos el hash de la contraseña
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(contraseña, salt);
  
    // Creamos el usuario en la base de datos
    try {
      const usuario = await Usuarios.create({ nombre, email, contraseña: hash });
      res.status(201).json({ message: 'usuario creado exitosamente' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: 'Error al crear el usuario' });
    }
  });

app.post('/apiV1/NodeFlix/usuario/login', async (req, res) => {
    const { email, contraseña } = req.body;
    try {
      const Usuario = await Usuarios.findOne({ where: { email }, raw: true });
      
      if (!Usuario) {
        return res.status(401).send({ message: 'el usuario no existe' });
      }
  
      const isValidPassword = await bcrypt.compare(contraseña, Usuario.contraseña);

      if (!isValidPassword) {
        return res.status(401).send({ message: 'Credenciales inválidas' });
      }
      
      const token = jwt.sign({id: Usuario.id}, jwtSemilla, { expiresIn: '48h' });

      res.status(200).send({ message: 'Autenticación exitosa', token });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error en el servidor' });
    }
  });


const PORT = 3000;

app.listen(PORT, () =>{
    console.log(`Servidor escuchando en el puerto: ${PORT}`)
});

/////////////////////////////////////////////////////////////////////////////////////////
//////////////////////                WebSocket                 /////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Se ha conectado un nuevo cliente');

  ws.on('message', function incoming(message) {
    console.log('Mensaje recibido: %s', message);
  });
  setInterval(async()=>{
    const peliculaAleatoria2 = await Catalogo.findOne({
        attributes: ['nombre','genero','puntaje'],
        order: sequelize.literal('NEWID()'),
        limit : 1,
        tableHint: 'TABLESAMPLE(1 ROWS)',
        where: { tipo:'Película' },
    });
    const mensaje = {
      event: 'pelicula del dia',
      data: peliculaAleatoria2
    };
    
    ws.send(JSON.stringify(mensaje));
  },2500);
});

