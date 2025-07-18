document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admin-form');
    const saveButton = document.getElementById('save-button');
    let portfolioData = {};

    const createInputElement = (key, value, section) => {
        const group = document.createElement('div');
        group.classList.add('form-group');
        const label = document.createElement('label');
        label.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        const input = document.createElement('input');
        input.type = 'text';
        input.name = `${section}-${key}`;
        input.value = value;
        group.appendChild(label);
        group.appendChild(input);
        return group;
    };

    const createTextareaElement = (key, value, section) => {
        const group = document.createElement('div');
        group.classList.add('form-group');
        const label = document.createElement('label');
        label.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        const textarea = document.createElement('textarea');
        textarea.name = `${section}-${key}`;
        textarea.rows = 3;
        textarea.textContent = value;
        group.appendChild(label);
        group.appendChild(textarea);
        return group;
    };

    const buildForm = (data) => {
        form.innerHTML = '';
        Object.keys(data).forEach(sectionKey => {
            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('form-section');
            const sectionTitle = document.createElement('h2');
            sectionTitle.textContent = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
            sectionDiv.appendChild(sectionTitle);

            if (sectionKey === 'stats') return;

            if (Array.isArray(data[sectionKey])) {
                data[sectionKey].forEach((item, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('list-item');
                    const itemTitle = document.createElement('h4');
                    itemTitle.textContent = `${sectionKey.slice(0, -1)} ${index + 1}`;
                    itemDiv.appendChild(itemTitle);
                    Object.keys(item).forEach(itemKey => {
                        itemDiv.appendChild(createInputElement(itemKey, item[itemKey], `${sectionKey}-${index}`))
                    });
                    sectionDiv.appendChild(itemDiv);
                });
            } else {
                Object.keys(data[sectionKey]).forEach(key => {
                    if (key === 'description') {
                         sectionDiv.appendChild(createTextareaElement(key, data[sectionKey][key], sectionKey));
                    } else {
                         sectionDiv.appendChild(createInputElement(key, data[sectionKey][key], sectionKey));
                    }
                });
            }
            form.appendChild(sectionDiv);
        });
    };

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            portfolioData = data;
            buildForm(portfolioData);
        })
        .catch(error => console.error('Error loading data:', error));

    saveButton.addEventListener('click', () => {
        const formData = new FormData(form);
        const updatedData = JSON.parse(JSON.stringify(portfolioData)); // Deep copy

        for (let [name, value] of formData.entries()) {
            const keys = name.split('-');
            if (keys.length === 2) {
                updatedData[keys[0]][keys[1]] = value;
            } else if (keys.length === 3) {
                updatedData[keys[0]][keys[1]][keys[2]] = value;
            }
        }

        const dataStr = JSON.stringify(updatedData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
});
