/*==================== DYNAMIC CONTENT LOADING ====================*/
document.addEventListener('DOMContentLoaded', () => {
    const loadPortfolio = async () => {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            loadProfileData(data);
            initializePage();
        } catch (error) {
            console.error('Failed to load portfolio data:', error);
        }
    };

    const loadProfileData = (data) => {
        // Profile
        document.getElementById('profile-img').src = data.profile.image;
        document.getElementById('profile-name').textContent = data.profile.name;
        document.getElementById('profile-title').textContent = data.profile.title;
        document.getElementById('profile-location').textContent = data.profile.location;
        document.getElementById('cv-download-link').href = data.profile.cv;

        // Socials
        document.getElementById('linkedin-link').href = data.socials.linkedin;
        document.getElementById('github-link').href = data.socials.github;
        document.getElementById('twitter-link').href = data.socials.twitter;
        document.getElementById('instagram-link').href = data.socials.instagram;
        document.getElementById('whatsapp-link').href = data.socials.whatsapp;
        


        // Skills
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = ''; // Clear existing
        data.skills.forEach(skill => {
            const li = document.createElement('li');
            li.innerHTML = `<i class='bx ${skill.icon}'></i> ${skill.name}`;
            skillsList.appendChild(li);
        });

        // Experience
        const experienceList = document.getElementById('experience-list');
        experienceList.innerHTML = ''; // Clear existing
        data.experience.forEach(exp => {
            const div = document.createElement('div');
            div.classList.add('experience__item');
            div.innerHTML = `<h4>${exp.title} <span>@ ${exp.company}</span></h4><p>${exp.description}</p>`;
            experienceList.appendChild(div);
        });

        // Education
        const educationList = document.getElementById('education-list');
        educationList.innerHTML = ''; // Clear existing
        data.education.forEach(edu => {
            const div = document.createElement('div');
            div.classList.add('experience__item'); // Re-use existing style
            div.innerHTML = `<h4>${edu.degree}</h4><p>${edu.institution} (${edu.period})</p>`;
            educationList.appendChild(div);
        });

        // Certifications
        const certificationsList = document.getElementById('certifications-list');
        certificationsList.innerHTML = ''; // Clear existing
        data.certifications.forEach(cert => {
            const li = document.createElement('li');
            li.innerHTML = `<i class='bx ${cert.icon}'></i> ${cert.name}`;
            certificationsList.appendChild(li);
        });

        // Contact
        document.getElementById('contact-email').textContent = data.contact.email;
        document.getElementById('contact-phone').textContent = data.contact.phone;
    };

    const initializePage = () => {
        // Initialize Tabs
        const tabs = document.querySelectorAll('.profile__tabs-item');
        const tabContents = document.querySelectorAll('.profile__content-item');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = document.querySelector(tab.dataset.target);
                tabContents.forEach(content => content.classList.remove('active-content'));
                if(target) target.classList.add('active-content');
                tabs.forEach(t => t.classList.remove('active-tab'));
                tab.classList.add('active-tab');
            });
        });

        // Initialize Theme
        const themeButton = document.getElementById('theme-button');
        const darkTheme = 'dark-theme';
        const lightIcon = 'bx-sun';
        const darkIcon = 'bx-moon';
        const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
        const updateIcon = () => {
            if (getCurrentTheme() === 'dark') {
                themeButton.classList.remove(lightIcon);
                themeButton.classList.add(darkIcon);
            } else {
                themeButton.classList.remove(darkIcon);
                themeButton.classList.add(lightIcon);
            }
        };
        const savedTheme = localStorage.getItem('selected-theme');
        if (savedTheme) {
            if (savedTheme === 'dark') document.body.classList.add(darkTheme);
        } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add(darkTheme);
        }
        updateIcon();
        themeButton.addEventListener('click', () => {
            document.body.classList.toggle(darkTheme);
            localStorage.setItem('selected-theme', getCurrentTheme());
            updateIcon();
        });

        // Initialize Modal
        const modal = document.getElementById('contact-modal');
        const openButton = document.getElementById('contact-button');
        const closeButton = document.getElementById('contact-close');
        const toggleModal = () => {
            modal.classList.toggle('show-modal');
            document.body.classList.toggle('body-no-scroll');
        };
        openButton.addEventListener('click', toggleModal);
        closeButton.addEventListener('click', toggleModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) toggleModal();
        });

        // Initialize EmailJS
        const contactForm = document.getElementById('contact-form');
        const contactMessage = document.getElementById('contact-message');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', '#contact-form', 'YOUR_PUBLIC_KEY')
                .then(() => {
                    contactMessage.textContent = 'Message sent successfully ';
                    setTimeout(() => { contactMessage.textContent = ''; }, 5000);
                    contactForm.reset();
                }, () => {
                    contactMessage.textContent = 'Message not sent (service error) ';
                });
        });
    };

    loadPortfolio();
});
