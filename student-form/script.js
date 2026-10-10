// ==========================================
// 📋 STUDENT REGISTRATION FORM ENGINE
// ==========================================
const form = document.getElementById('registrationForm');
const successBanner = document.getElementById('successBanner');

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Stop native page reload bugs
    
    // Clear out any previous banner states
    successBanner.style.display = 'none';

    // Run custom field metrics evaluations
    const isFormValid = validateFormFields();

    if (isFormValid) {
        // Collect and print inputs to verification matrix console safely
        const studentProfile = {
            name: document.getElementById('fullName').value.trim(),
            email: document.getElementById('studentEmail').value.trim(),
            phone: document.getElementById('studentPhone').value.trim(),
            gender: document.querySelector('input[name="gender"]:checked').value,
            course: document.getElementById('courseSelect').value
        };

        console.log("Registration Profile Created Successfully:", studentProfile);

        // Display confirmation alert banner UI response
        successBanner.style.display = 'block';

        // Clear input tracking spaces
        form.reset();
        clearValidationStates();
    }
});

function validateFormFields() {
    let isValid = true;

    // 1. Full Name Processing Evaluation
    const nameInput = document.getElementById('fullName');
    if (nameInput.value.trim().length < 3) {
        setErrorState(nameInput, true);
        isValid = false;
    } else {
        setErrorState(nameInput, false);
    }

    // 2. Regex Email Configuration Test
    const emailInput = document.getElementById('studentEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        setErrorState(emailInput, true);
        isValid = false;
    } else {
        setErrorState(emailInput, false);
    }

    // 3. 10-Digit Mobile String Match evaluation
    const phoneInput = document.getElementById('studentPhone');
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneInput.value.trim())) {
        setErrorState(phoneInput, true);
        isValid = false;
    } else {
        setErrorState(phoneInput, false);
    }

    // 4. Dropdown Program Selection Matrix verification
    const courseSelect = document.getElementById('courseSelect');
    if (courseSelect.value === "") {
        setErrorState(courseSelect, true);
        isValid = false;
    } else {
        setErrorState(courseSelect, false);
    }

    return isValid;
}

// State Control Handlers
function setErrorState(inputElement, hasError) {
    const parentContainer = inputElement.closest('.input-group');
    if (hasError) {
        parentContainer.classList.add('invalid');
    } else {
        parentContainer.classList.remove('invalid');
    }
}

function clearValidationStates() {
    const inputGroups = document.querySelectorAll('.input-group');
    inputGroups.forEach(group => group.classList.remove('invalid'));
}
