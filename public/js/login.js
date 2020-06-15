function login() {
  const username = document.getElementById("input-user").value;
  const password = document.getElementById("input-password").value;
  console.log(username, password);
  
  const userbody = JSON.stringify({
    username: username,
    password: password
  });
  
  const xhr = new XMLHttpRequest();
  
  xhr.onload = function () {
  console.log(this.responseText);
  if (this.status !== 200) {
    const result = document.getElementById("result");
    result.style.color = "darkred";
    result.textContent = this.responseText;
  } else {
    window.location.href = "/main-page"
  }
  }

xhr.open("POST", "/login");

xhr.setRequestHeader("Content-type", "application/json");

xhr.send(userbody);
  
};