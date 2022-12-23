let currentUser;
let userToken;

function startButton() {
  document.getElementById("start-section").hidden = true;
  document.getElementById("login-section").hidden = false;
}

function loginButton() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const response = fetch("https://weekly.herokuapp.com/login", {
    method: "POST",
    body: JSON.stringify({ email: email, password: password }),
  })
    .then((data) => {
      return data.json();
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error;
    });

  window.alert(response);
}
