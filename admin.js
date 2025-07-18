document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admin-form');
    const saveButton = document.getElementById('save-button');
    let portfolioData = {};

    const schemas = {
        skills: { icon: '', name: '' },
        experience: { title: '', company: '', period: '', description: '' },
        education: { degree: '', institution: '', period: '' },
        certifications: { icon: '', name: '' }
    };

    const buildForm = () => {
        form.innerHTML = '';
        Object.keys(portfolioData).forEach(sectionKey => {
            if (sectionKey === 'stats') return; 

            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('form-section');
            const sectionTitle = document.createElement('h2');
            sectionTitle.textContent = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
            sectionDiv.appendChild(sectionTitle);

            if (Array.isArray(portfolioData[sectionKey])) {
                portfolioData[sectionKey].forEach((item, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('list-item');
                    
                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    removeButton.classList.add('admin-button', 'remove-button');
                    removeButton.type = 'button';
                    removeButton.onclick = () => {
                        portfolioData[sectionKey].splice(index, 1);
                        buildForm();
                    };
                    itemDiv.appendChild(removeButton);

                    const itemTitle = document.createElement('h4');
                    itemTitle.textContent = `${sectionKey.slice(0, -1)} ${index + 1}`;
                    itemDiv.appendChild(itemTitle);

                    Object.keys(item).forEach(itemKey => {
                        const group = document.createElement('div');
                        group.classList.add('form-group');
                        const label = document.createElement('label');
                        label.textContent = itemKey.charAt(0).toUpperCase() + itemKey.slice(1);
                        const input = itemKey === 'description' ? document.createElement('textarea') : document.createElement('input');
                        input.value = item[itemKey];
                        input.oninput = (e) => item[itemKey] = e.target.value;
                        group.appendChild(label);
                        group.appendChild(input);
                        itemDiv.appendChild(group);
                    });
                    sectionDiv.appendChild(itemDiv);
                });

                const addButton = document.createElement('button');
                addButton.textContent = `+ Add ${sectionKey.slice(0, -1)}`;
                addButton.classList.add('admin-button', 'add-button');
                addButton.type = 'button';
                addButton.onclick = () => {
                    const newItem = { ...schemas[sectionKey] };
                    if (newItem) {
                        portfolioData[sectionKey].push(newItem);
                        buildForm();
                    }
                };
                sectionDiv.appendChild(addButton);

            } else {
                Object.keys(portfolioData[sectionKey]).forEach(key => {
                    const group = document.createElement('div');
                    group.classList.add('form-group');
                    const label = document.createElement('label');
                    label.textContent = key.charAt(0).toUpperCase() + key.slice(1);
                    const input = document.createElement('input');
                    input.value = portfolioData[sectionKey][key];
                    input.oninput = (e) => portfolioData[sectionKey][key] = e.target.value;
                    group.appendChild(label);
                    group.appendChild(input);
                    sectionDiv.appendChild(group);
                });
            }
            form.appendChild(sectionDiv);
        });
    };

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            portfolioData = data;
            buildForm();
        })
        .catch(error => console.error('Error loading data:', error));

    saveButton.addEventListener('click', () => {
        const dataStr = JSON.stringify(portfolioData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
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
