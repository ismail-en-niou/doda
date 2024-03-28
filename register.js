document.getElementById('submit').addEventListener('click', async function (event) {
    event.preventDefault();
    console.log("slm")
    const error = document.getElementById('error'); // Define error element

    error.innerHTML = ""; // Clear error message

    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById("cpassword2").value;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // Added missing quantifier for password regex

    try {
        if (password !== confirmPassword) {
            error.innerHTML = "The password and the confirmed password do not match.";
            document.getElementById('newUsername').value = ''; // Clear username field
            document.getElementById('newPassword').value = ''; // Clear password field
            document.getElementById("cpassword2").value = ''; // Clear confirm password field
            return;
        } 

        if (!passwordRegex.test(password)) {
            error.innerHTML = "Your password must be at least 8 characters long and contain at least one letter, one digit, and one special character (!@#$%^&*).";
            document.getElementById('newPassword').value = ''; // Clear password field
            document.getElementById("cpassword2").value = ''; // Clear confirm password field
            return;
        }

        const response = await fetch('https://doda-o6sz.onrender.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: username, password: password })
        });

        const responseData = await response.json();
        if (responseData.statut == 1) { // Changed "statut" to "status"
            error.innerHTML = `${responseData.message}`;
            document.getElementById('newUsername').value = ''; // Clear username field
            document.getElementById('newPassword').value = ''; // Clear password field
            document.getElementById("cpassword2").value = ''; // Clear confirm password field
            return;
        } else if (responseData.statut == 0) { // Changed "statut" to "status"
            window.location.href = "./login.html"; // Redirect if conditions met
            return;
        } 

    } catch (error) {
        console.error('Error:', error);
    }
});
