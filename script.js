/*==================== TABS ====================*/
const tabs = document.querySelectorAll('.profile__tabs-item');
const tabContents = document.querySelectorAll('.profile__content-item');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target);

        // Hide all content
        tabContents.forEach(content => {
            content.classList.remove('active-content');
        });

        // Show the target content
        if (target) {
            target.classList.add('active-content');
        }

        // Deactivate all tabs
        tabs.forEach(t => {
            t.classList.remove('active-tab');
        });

        // Activate the clicked tab
        tab.classList.add('active-tab');
    });
});

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';
const lightIcon = 'bx-sun';
const darkIcon = 'bx-moon';

// Function to get the current theme
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';

// Function to update the theme icon
const updateIcon = () => {
    if (getCurrentTheme() === 'dark') {
        themeButton.classList.remove(lightIcon);
        themeButton.classList.add(darkIcon);
    } else {
        themeButton.classList.remove(darkIcon);
        themeButton.classList.add(lightIcon);
    }
};

// Check for saved theme preference
const savedTheme = localStorage.getItem('selected-theme');
if (savedTheme) {
    if (savedTheme === 'dark') {
        document.body.classList.add(darkTheme);
    }
} else {
    // Default to system preference if no theme is saved
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add(darkTheme);
    }
}

// Set the initial icon
updateIcon();

// Theme toggle button event listener
themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme);
    localStorage.setItem('selected-theme', getCurrentTheme());
    updateIcon();
});

/*==================== CONTACT MODAL ====================*/
const modal = document.getElementById('contact-modal');
const openButton = document.getElementById('contact-button');
const closeButton = document.getElementById('contact-close');

const toggleModal = () => {
    modal.classList.toggle('show-modal');
    document.body.classList.toggle('body-no-scroll');
};

openButton.addEventListener('click', toggleModal);
closeButton.addEventListener('click', toggleModal);

// Close modal when clicking outside of it
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        toggleModal();
    }
});

/*==================== EMAIL JS ====================*/
const contactForm = document.getElementById('contact-form'),
      contactMessage = document.getElementById('contact-message');

const sendEmail = (e) => {
    e.preventDefault();

    // serviceID - templateID - #form - publicKey
    emailjs.sendForm('service_2ef4dog', 'template_4bhnq3u', '#contact-form', '_7XWo1TlM6iEzuZRY')
        .then(() => {
            // Show sent message
            contactMessage.textContent = 'Message sent successfully ✅';

            // Remove message after five seconds
            setTimeout(() => {
                contactMessage.textContent = '';
            }, 5000);

            // Clear input fields
            contactForm.reset();
        }, () => {
            // Show error message
            contactMessage.textContent = 'Message not sent (service error) ❌';
        });
};

contactForm.addEventListener('submit', sendEmail);

