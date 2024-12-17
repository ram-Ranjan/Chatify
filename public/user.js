const BASE_URL = "http://localhost:3000/api";

// addEventListener-👍   or create onsubmit event from frontend
// Separation of concerns and improves maintainibility and scalability of code

const form = document.getElementById("registerForm");
//const submitBtn = document.getElementById('register-btn');
if(form){
    form.addEventListener("submit", function (event)  {
        event.preventDefault();
      
        //const {username,email,password,phone}=form.data;
      
        const formData = new FormData(event.target);
      
        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");
        const phone = formData.get("phone");
      
        const User = { username, email, password, phone };
      
        axios
          .post(`${BASE_URL}/user/register`, User)
          .then(() => {
            // console.log(res);
      
            console.log("User Registered");
            document.getElementById("registerForm").reset();
            window.confirm("User Signed Up Successfully");
          })
          .catch((err) => {
            if (err.response && err.response.status === 409) {
              //409 conflict status code(violates the unique constraint)
              alert(
                "This email is already registered. Please use another one or log in."
              );
            } else {
              console.error(err);
            }
          });
      });
}


const loginForm = document.getElementById("loginForm");
if(loginForm){
    loginForm.addEventListener("submit",function (event) {
        event.preventDefault();
      
        const formData = new FormData(event.target);
      
        const email = formData.get("email");
        const password = formData.get("password");
      
        if (!email || !password) {
          alert("Please fill email and password properly");
          return;
        }
      
        const User = { email: email, password: password };
        axios
          .post(`${BASE_URL}/user/login`, { email, password })
          .then((response) => {
            localStorage.setItem("authToken", response.data.token);
            if(response.data.username){
            }
            localStorage.setItem("username", response.data.username);
             alert("User Logged In successfully!");

            window.location.href='home.html';


            // window.location.href='dashboard.html';
          })
          .catch((error) => {
            if (error.response && error.response.status == 401) {
              alert("Incorrect Credentials");
            } else {
              const errorMessage =
              error.response?.data?.error || "An unknown error occurred";
            alert("User Log In Failed: " + errorMessage);
              }
          });
      });
}

