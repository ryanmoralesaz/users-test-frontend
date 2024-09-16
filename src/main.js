// src/main.js
import { CONFIG } from './config'
// Function to attach event listeners to the form elements
function attachFormEventListeners() {
    const submitForm = document.getElementById('submit-user');
    const updateForm = document.getElementById('updateForm');

    if (submitForm) {
        submitForm.addEventListener('submit', handleSubmitForm);
    }

    if (updateForm) {
        updateForm.addEventListener('submit', handleUpdateForm);
    }

    renderUsers();
}

// Function to handle form submission
async function handleSubmitForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((value, key) => { data[key] = value });
    try {
        const response = await fetch(`${window.CONFIG.API_BASE_URL}/submit-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log('User submitted:', result);
        e.target.reset();
        renderUsers();
    } catch (error) {
        console.error('Error submitting user:', error.message);
        // alert('Error submitting user: ' + error.message);
    }
}

// Function to handle user updates
async function handleUpdateForm(e) {
    e.preventDefault();
    const currentName = document.getElementById('currentName').value;
    const currentEmail = document.getElementById('currentEmail').value;
    const newName = document.getElementById('newName').value;
    const newEmail = document.getElementById('newEmail').value;
    try {
        const response = await fetch(
            `${window.CONFIG.API_BASE_URL}/update-user/${currentName}/${currentEmail}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newName, newEmail }),
            }
        );
        const data = await response.json();
        console.log('User updated:', data);
        alert('User updated successfully');
        e.target.reset();
        renderUsers();
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Error updating user: ' + error.message);
    }
}

// Function to fetch users from the backend
async function fetchUsers() {
    try {
        const response = await fetch(`${window.CONFIG.API_BASE_URL}/users`);
        if (!response.ok) {
            throw new Error('Error fetching users. Response not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem fetching users:', error);
        throw error;
    }
}

// Function to render users in the table
async function renderUsers() {
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) {
        console.error('User table body not found');
        return;
    }
    tableBody.innerHTML = '';
    try {
        const users = await fetchUsers();
        if (Array.isArray(users) && users.length > 0) {
            users.forEach((user) => {
                const row = `<tr><td>${user.name}</td><td>${user.email}</td></tr>`;
                tableBody.innerHTML += row;
            });
            // fetchForm();
        } else {
            tableBody.innerHTML = "<tr><td colspan='2'>No users found</td></tr>";
        }
    } catch (error) {
        console.error('Error rendering users:', error);
        tableBody.innerHTML = "<tr><td colspan='2'>Error loading users</td></tr>";
    }
}

const fetchForm = async () => {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/form`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const formHTML = await response.text();

        // Insert the form HTML into the main content
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = formHTML;

        // Attach event listeners to the new form elements
        attachFormEventListeners();
    } catch (error) {
        console.error('Error fetching form:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.CONFIG = CONFIG;
    console.log(`${window.CONFIG.API_BASE_URL}/form`);
    const mainContent = document.createElement('main');
    mainContent.setAttribute('id', 'main-content');
    mainContent.setAttribute('hx-target', `this`);
    mainContent.setAttribute('hx-trigger', `click`);
    mainContent.setAttribute('hx-swap', `innerHTML`);
    mainContent.setAttribute('hx-get', `${window.CONFIG.API_BASE_URL}/form`);
    mainContent.innerHTML = 'Hello World';
    document.body.appendChild(mainContent);
    fetchForm();
});
