// Obtener referencia a los elementos de la lista 1
const movieList = document.getElementById('movies');
const sortSelect = document.getElementById('sort-by');

// Función para obtener los datos de la API y mostrarlos en la vista
async function getMovies() {
  try {
    const response = await fetch('http://localhost:3000/apiV1/NodeFlix/catalogo/ordenarPeliculas');
    const movies = await response.json();
    console.log(movies);
    showMovies(movies);
  } catch (error) {
    console.error('Error al obtener las películas:', error);
  }
}

// Función para mostrar las películas en la vista
function showMovies(movies) {
  // Limpiar la lista de películas
    movieList.innerHTML = '';

  // Ordenar las películas según el criterio seleccionado por el usuario
  const sortValue = sortSelect.value;
  console.log(sortValue);
  switch (sortValue) {
    case 'nombre':
      movies.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case 'tipo':
      movies.sort((a, b) => a.tipo.localeCompare(b.tipo));
      break;
    case 'genero':
      movies.sort((a, b) => a.genero.localeCompare(b.genero));
      break;
    case 'puntaje':
      movies.sort((a, b) => b.puntaje - a.puntaje);
      break;
  }

  // Mostrar las películas en la lista
  movies.forEach(movie => {
    const movieItem = document.createElement('li');
    movieItem.textContent = `${movie.nombre} (${movie.tipo}) - ${movie.genero} - ${movie.puntaje}`;
    movieList.appendChild(movieItem);
  });
}

// Cargar las películas al cargar la página
getMovies();

// Actualizar las películas al cambiar el criterio de ordenamiento
sortSelect.addEventListener('change', getMovies);

document.getElementById("inicio-v2").addEventListener("click", function() {
    window.location.href = "\index.html";
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Filtrando por busqueda
// Definimos una función que se encarga de hacer la petición al endpoint
// Obtener referencia a los elementos de la lista 1
const movieList2 = document.getElementById('movies');

async function obtenerPeliculasFiltradas() {
    const nombre = document.getElementById("nombre").value.trim();
    const genero = document.getElementById("genero").value;
    const tipo = document.querySelector('input[name="tipo"]:checked')?.value;

    // Validar que el nombre no sea una cadena vacía
    const body = {};
    if (nombre !== "") {
        body.nombre = nombre;
    }
    if (tipo !== "") {
        body.tipo = tipo;
    }
    if (genero !== "") {
        body.genero = genero;
    }
    console.log(body);
    try {
      const endpoint = `http://localhost:3000/apiV1/NodeFlix/catalogo/peliculasFiltro`;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log(data);
      showMovieslist2(data);
      genero.selectedIndex = -1;
    } catch (error) {
      console.log(error);
    }
  }
  
// Función para mostrar las películas en la vista
function showMovieslist2(movies) {
    // Limpiar la lista de películas
    movieList2.innerHTML = '';
    // Mostrar las películas en la lista
    movies.forEach(movie => {
      const movieItem = document.createElement('li');
      movieItem.textContent = `${movie.nombre} (${movie.tipo}) - ${movie.genero} - ${movie.puntaje}`;
      movieList2.appendChild(movieItem);
    });
}
// Escuchamos los eventos de click en los botones de filtro
const botonBusqueda = document.getElementById('search-button')
botonBusqueda.addEventListener('click', async (event) => {
    event.preventDefault();
   obtenerPeliculasFiltradas();
});


//boton aleatorio
const botonAleatorio = document.getElementById('btn-aleatorio');
botonAleatorio.addEventListener("click", obtenerPeliculaAleatoria);

// Función para obtener una película aleatoria
async function obtenerPeliculaAleatoria() {
    try {
      const response = await fetch('http://localhost:3000/apiV1/NodeFlix/catalogo/peliculaAleatoria');
      if (!response.ok) {
        throw new Error("Error al obtener la película aleatoria");
      }
      const pelicula = await response.json();
      console.log(pelicula);
      mostrarPelicula(pelicula);
    } catch (error) {
      console.error(error);
    }
  }
  

  function mostrarPelicula(movie) {
    const moviesList3 = document.getElementById("movies2");
    moviesList3.innerHTML = '';
    // Mostrar las películas en la lista
    const movieItem = document.createElement('li');
    movieItem.classList.add('movie-item'); // Agregar clase al elemento li
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'viewed';
    checkbox.value = movie.id; // Podemos utilizar el id de la película como valor del checkbox
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            marcarVisto(movie.id);
        }
    });
    // Crear input para editar el puntaje
    const puntajeInput = document.createElement('input');
    puntajeInput.type = 'number';
    puntajeInput.min = '1';
    puntajeInput.max = '5';
    puntajeInput.value = movie.puntaje;
    puntajeInput.addEventListener('change', () => {
        editarPuntaje(movie.id, parseFloat(puntajeInput.value));
    });
    const label = document.createElement('label');
    label.textContent = `${movie.nombre} (${movie.tipo}) - ${movie.genero} - ${movie.puntaje}`;
    movieItem.appendChild(checkbox);
    movieItem.appendChild(puntajeInput);
    movieItem.appendChild(label);
    moviesList3.appendChild(movieItem);
  }
  
  async function marcarVisto(id) {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjgyOTg3MjcyLCJleHAiOjE2ODMxNjAwNzJ9.IpAgz_DIqkIcB4WekYZGYEz5c9Ir86rvU8SiliYUjV0';
  
    try {
      const response = await fetch(`http://localhost:3000/apiV1/NodeFlix/usuarios/vistos/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const alertContainer2 = document.getElementById('alert-container2');
        alertContainer2.innerHTML = `<div class="alert-success">Película marcada como vista</div>`;
        alertContainer2.style.display = 'block';
        setTimeout(() => {
            document.querySelector('.alert-success').style.display = 'none';
        },1500);
      } else {
        throw new Error('Error al marcar la película como vista');
      }
  
    } catch (error) {
      const alertContainer2 = document.getElementById('alert-container2');
      alertContainer2.innerHTML = `<div class="alert-danger">${error.message}</div>`;
      alertContainer2.style.display = 'block';
      setTimeout(() => {
            document.querySelector('.alert-danger').style.display = 'none';
        },1500);
    }
  }

  
  async function editarPuntaje(id, puntaje) {
    
    const response = await fetch(`http://localhost:3000/apiV1/NodeFlix/usuarios/repertorio/${id}/puntaje`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjgyOTg3MjcyLCJleHAiOjE2ODMxNjAwNzJ9.IpAgz_DIqkIcB4WekYZGYEz5c9Ir86rvU8SiliYUjV0'
      },
      body: JSON.stringify({ puntaje })
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
        const alertContainer2 = document.getElementById('alert-container2');
      alertContainer2.innerHTML = `<div class="alert-success">${data.message}</div>`;
      alertContainer2.style.display = 'block';
      setTimeout(() => {
        document.querySelector('.alert-success').style.display = 'none';
    },1500);
    } else {
        const alertContainer2 = document.getElementById('alert-container2');
      alertContainer2.innerHTML = `<div class="alert-danger">${data.message}</div>`;
      alertContainer2.style.display = 'block';
      setTimeout(() => {
        document.querySelector('.alert-danger').style.display = 'none';
        },1500);
    }
}
  


//////////////////////////////////////////////////////////////////////////////////////
// WEBSOCKET

// Obtener la sección de la película del día
const peliculaDelDiaSection = document.getElementById('pelicula-del-dia');

// Obtener el contenedor de información de la película del día
const peliculaDelDiaInfo = peliculaDelDiaSection.querySelector('#pelicula-del-dia-info');


const socket = new WebSocket('ws://localhost:8080');
// Agregando listeners a eventos del socket
socket.addEventListener('open', function (event) {
    console.log('Conexión establecida con el servidor');
});
  
// Recibir la información de la película del día del servidor
socket.addEventListener('message', function (event) {
    //console.log('Mensaje recibido del servidor:', event.data);
  
    const message = JSON.parse(event.data);
  
    if (message.event === 'pelicula del dia') {
      const pelicula = message.data;
      // Actualizar el HTML de la sección correspondiente con la información de la película del día
        peliculaDelDiaInfo.innerHTML = `
            <p>Nombre: ${pelicula.nombre}</p>
            <p>Género: ${pelicula.genero}</p>
            <p>Puntaje: ${pelicula.puntaje}</p>
        `;
    } 
  });


  

  
