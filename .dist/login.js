function validateLogin() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let error = document.getElementById("error");

    if (username === "" || password === "") {
        error.innerHTML = "All fields are required!";
        return false;
    }

    if (username === "admin" && password === "12345") {
        alert("Login Successful!");
        return true;
    } else {
        error.innerHTML = "Invalid username or password!";
        return false;
    }
}
