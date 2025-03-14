let slideIndex = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

function showSlides() {
    slides.forEach((slide) => {
        slide.style.opacity = "0";
    });

    slides[slideIndex].style.opacity = "1";
    slideIndex = (slideIndex + 1) % totalSlides;
}

showSlides(); 
setInterval(showSlides, 5000);

document.getElementById("signUpForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!username || !email || !password || !confirmPassword) {
        alert("Please fill out all fields.");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const passwordMinLength = 8;
    if (password.length < passwordMinLength) {
        alert(`Password must be at least ${passwordMinLength} characters long.`);
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const formData = new FormData(this);

    try {
        const response = await fetch('/register', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.status === "success") {
            alert("Registration successful! Redirecting to login...");
            window.location.href = "/";
        } else {
            alert(data.message || "Registration failed. Please try again.");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("An error occurred. Please try again later.");
    }
});