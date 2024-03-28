document.getElementById('submit').addEventListener('click', async function (event) {
    event.preventDefault();
    const error = document.getElementById('error'); 
    error.innerHTML = ""; 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://doda-o6sz.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: username, password: password })
        });

        const responseData = await response.json(); // Corrected method name
        console.log(responseData);
        if (responseData.statut == 1) { // Changed "statut" to "status"
            error.innerHTML = `${responseData.message}`;
            username.value = ''; // Clear username field
           password.value = ''; // Clear password field
            document.getElementById("cpassword2").value = ''; // Clear confirm password field
            return;
        } else  if(responseData.statut == 0){
            window.location.href ="./to do/index.html"
        }
        function setCookie(name, value, daysTolive) {
            const date = new Date();
            date.setTime(date.getTime() + (daysTolive * 24 * 60 * 60 * 1000));
            let expires = "exprise" + date.toUTCString();
            document.cookie = `${name} = ${value} ; ${expires} ; path=/`

        }
        setCookie("userid", username, 365);
       
    } catch (error) {
        console.error('Error:', error);
    }
});