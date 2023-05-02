// Variables globales
let autenticacionInicio = false;
const loginButton = document.getElementById("login-button");
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorContainer = document.getElementById("error-container");
const closeButton = document.getElementById('close-button');
// Event listeners
loginButton.addEventListener("click", toggleLoginForm);
loginForm.addEventListener("submit", submitLoginForm);
closeButton.addEventListener('click', toggleLoginForm);

// Funciones
function toggleLoginForm() {
  loginForm.style.display = loginForm.style.display === "none" ? "block" : "none";
}

async function submitLoginForm(event) {
  event.preventDefault();

  const email = emailInput.value;
  const contraseña = passwordInput.value;

  // Validación de campos
  if (!email || !contraseña) {
    errorContainer.innerText = "Por favor ingresa tu correo electrónico y contraseña";
    return;
  }

  // Aquí iría el código para enviar los datos a un servidor o hacer una petición API
  try {
    const response = await fetch('http://localhost:3000/apiV1/NodeFlix/usuario/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, contraseña })
    });

    if(response.ok){
      // Mostrar ventana emergente de autenticación exitosa
      const data = await response.json();
      const alertContainer = document.getElementById('alert-container');
      alertContainer.innerHTML = '<div class="alert-success">Autenticación exitosa</div>';
      alertContainer.style.display = 'block';
      setTimeout(() => {
        document.querySelector('.alert-success').style.display = 'none';
        },1500);
      // Limpiar campos y esconder formulario
      emailInput.value = "";
      passwordInput.value = "";
      // toggleLoginForm();
    //   // redirigir a la otra vista
         window.location.href = '\index2.html';
    }else{
      // Mostrar ventana emergente de autenticación no exitosa
      const alertContainer = document.getElementById('alert-container');
      alertContainer.innerHTML = '<div class="alert-danger">Autenticación fallida</div>';
      alertContainer.style.display = 'block';
      setTimeout(() => {
        document.querySelector('.alert-danger').style.display = 'none';
        },1500);
     }
  } catch (error) {
    console.error("Error al enviar la solicitud",error);
  }
}






