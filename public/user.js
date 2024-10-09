
const BASE_URL='http://localhost:3000/api';


// addEventListener-👍   or create onsubmit event from frontend
// Separation of concerns and improves maintainibility and scalability of code

const form = document.getElementById('registerForm');
//const submitBtn = document.getElementById('register-btn');
form.addEventListener('submit',(event) => {
    event.preventDefault();

    //const {username,email,password,phone}=form.data;

    const formData = new FormData(event.target);

    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const phone = formData.get('phone');

    const User = {username,email,password,phone};

    axios.post(`${BASE_URL}/user/register`,User)
    .then(() => {
        // console.log(res);
      
            console.log("User Registered")
            document.getElementById('registerForm').reset();
            window.confirm("User Signed Up Successfully");
    
        
    })
    .catch(err => {
        if (err.response && err.response.status === 409) { //409 conflict status code(violates the unique constraint)
            alert('This email is already registered. Please use another one or log in.');
        } else {
            console.error(err);
        }
});

})

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit',(event)=>{
    event.preventDefault();

    const formData = new FormData(event.target);

    const email = formData.get('email');
    const password = formData.get('password');

    if(!email || !password){
        alert("Please fill email and password properly");
        return;
    }


    const User ={ email:email,password:password};

    axios.post(`${BASE_URL}/user/login`,{email,password})
        .then(response => {
            localStorage.setItem('authToken',response.data.token);
            // window.location.href='dashboard.html';
        })
        .catch(error => {
            if(error.response && error.response.status == 401){
                alert("Incorrect Credentials");
            }
            else{
                alert('Login failed. Please try again later.')
            }
        })

})

