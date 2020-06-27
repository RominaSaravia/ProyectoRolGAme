function register() {
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
    const result = document.getElementById("result");
    result.style.color = "blue";
    result.textContent = this.responseText;

  setTimeout(() => {
  window.location.href = "/";

  },2000);

}

}

xhr.open("POST", "/register");
xhr.setRequestHeader("Content-type", "application/json");
xhr.send(userbody);
  
};