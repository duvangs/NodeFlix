# NodeFlix

## Descripción
Proyecto backend de un servicio de streaming de películas y series desarrollado con Node.js y SQL Server.

## Requisitos
- Node.js
- SQL Server
- npm

## Instalación
1. Clonar este repositorio en tu máquina local.
2. Abrir una terminal en la raíz del proyecto y ejecutar el comando `npm install`.
3. Configurar las variables de entorno en el archivo `.env`.
4. Ejecutar el comando `npm start`.

## Uso
Para utilizar este servicio se pueden hacer peticiones HTTP a las distintas rutas definidas en la API.

### Rutas disponibles

#### Obtener una película o serie aleatoria

GET /apiV1/NodeFlix/catalogo/peliculaAleatoria

Devuelve un objeto JSON con los datos de una película o serie aleatoria de la base de datos.

#### Obtener todas las películas o series ordenadas

GET /apiV1/NodeFlix/catalogo/ordenarPeliculas

Devuelve un arreglo de objetos JSON con los datos de todas las películas o series de la base de datos, ordenadas según los criterios especificados en el cuerpo de la petición.

### Variables de entorno

Para ejecutar este servicio se deben configurar las siguientes variables de entorno en el archivo `.env`:
- `PORT`: Puerto en el que se ejecutará el servidor.
- `DB_USER`: Usuario de la base de datos.
- `DB_PASSWORD`: Contraseña del usuario de la base de datos.
- `DB_DATABASE`: Nombre de la base de datos.
- `DB_SERVER`: Dirección del servidor de la base de datos.

### Dependencias utilizadas
- express
- cors
- body-parser
- bcrypt
- jwt
- sequelize
- dotenv

## Contribución
Este proyecto está abierto a contribuciones. Si quieres contribuir, puedes hacer un fork del repositorio, hacer los cambios que consideres necesarios y crear un pull request.

## Licencia
Este proyecto está bajo la licencia MIT.
