document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(this);

        try {
            const response = await fetch('/login', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.status === "success") {
                localStorage.setItem("access_token", data.access_token);
                alert("Login successful! Redirecting to home...");
                window.location.href = "/home";
            } else {
                alert(data.message || "Invalid login attempt.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred. Please try again later.");
        }
    });
});
