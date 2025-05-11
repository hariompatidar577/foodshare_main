document.addEventListener('DOMContentLoaded', function () {

    setupImageUpload();


    setupTabs();


    setupForms();


    if (navigator.geolocation) {
        document.getElementById('detectLocation').addEventListener('click', function (e) {
            e.preventDefault();
            navigator.geolocation.getCurrentPosition(function (position) {


                document.getElementById('pickupLocation').value =
                    "Lat: " + position.coords.latitude.toFixed(4) +
                    ", Long: " + position.coords.longitude.toFixed(4);
            });
        });
    } else {
        document.getElementById('detectLocation').style.display = 'none';
    }



    const donationButtons = document.querySelectorAll('.donation-amount');
    donationButtons.forEach(button => {
        button.addEventListener('click', function () {


            donationButtons.forEach(btn => {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
            });



            this.classList.remove('btn-secondary');
            this.classList.add('btn-primary');



            document.getElementById('customAmount').value = this.getAttribute('data-amount');
        });
    });
});


function setupImageUpload() {
    const uploadArea = document.getElementById('imageUploadArea');
    const imageInput = document.getElementById('imageUpload');
    const previewArea = document.getElementById('imagePreview');

   

    uploadArea.addEventListener('click', function () {
        imageInput.click();
    });


    uploadArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#4CAF50';
        uploadArea.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
    });

    uploadArea.addEventListener('dragleave', function () {
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.backgroundColor = 'transparent';
    });


    uploadArea.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.backgroundColor = 'transparent';

        if (e.dataTransfer.files.length > 0) {
            imageInput.files = e.dataTransfer.files;
            handleImagePreview(e.dataTransfer.files);
        }
    });

    imageInput.addEventListener('change', function () {
        handleImagePreview(this.files);
    });


    function handleImagePreview(files) {
        previewArea.innerHTML = '';

        if (files.length === 0) {
            return;
        }

        const maxFiles = 5;
        const filesToProcess = Math.min(files.length, maxFiles);

        for (let i = 0; i < filesToProcess; i++) {
            const file = files[i];


            if (!file.type.match('image.*')) {
                continue;
            }

            const reader = new FileReader();

            reader.onload = function (e) {
                const previewContainer = document.createElement('div');
                previewContainer.className = 'preview-container';
                previewContainer.style.position = 'relative';
                previewContainer.style.display = 'inline-block';
                previewContainer.style.marginRight = '10px';

                const img = document.createElement('img');
                img.className = 'preview-img';
                img.src = e.target.result;
                previewContainer.appendChild(img);



                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '&times;';
                removeBtn.style.position = 'absolute';
                removeBtn.style.top = '0';
                removeBtn.style.right = '0';
                removeBtn.style.backgroundColor = 'rgba(0,0,0,0.5)';
                removeBtn.style.color = 'white';
                removeBtn.style.border = 'none';
                removeBtn.style.borderRadius = '50%';
                removeBtn.style.width = '20px';
                removeBtn.style.height = '20px';
                removeBtn.style.display = 'flex';
                removeBtn.style.justifyContent = 'center';
                removeBtn.style.alignItems = 'center';
                removeBtn.style.cursor = 'pointer';

                removeBtn.addEventListener('click', function () {
                    previewContainer.remove();
                });

                previewContainer.appendChild(removeBtn);
                previewArea.appendChild(previewContainer);
            };

            reader.readAsDataURL(file);
        }

        if (files.length > maxFiles) {
            const message = document.createElement('p');
            message.style.fontSize = '0.8rem';
            message.style.color = '#666';
            message.textContent = `Showing ${maxFiles} of ${files.length} selected images`;
            previewArea.appendChild(message);
        }
    }
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function switchModal(closeModalId, openModalId) {
    closeModal(closeModalId);
    openModal(openModalId);
}

window.onclick = function (event) {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
};


function setupTabs() {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));

            this.classList.add('active');

            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));

            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}


function setupForms() {

    const foodDonationForm = document.getElementById('foodDonationForm');
    if (foodDonationForm) {
        foodDonationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);

            const imageInput = document.getElementById('imageUpload');
            if (imageInput.files.length > 0) {
                for (let i = 0; i < imageInput.files.length; i++) {
                    formData.append('food_images[]', imageInput.files[i]);
                }
            }

            
            showNotification('Food donation listing created successfully!', 'success');


            this.reset();
            document.getElementById('imagePreview').innerHTML = '';
        });
    }

    
    const financialDonationForm = document.getElementById('financialDonationForm');
    if (financialDonationForm) {
        financialDonationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            showNotification('Thank you for your donation!', 'success');

            this.reset();

            const donationButtons = document.querySelectorAll('.donation-amount');
            donationButtons.forEach(btn => {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
            });
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            closeModal('loginModal');
            showNotification('You have successfully logged in!', 'success');

            updateAuthButtons(true);

            this.reset();
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();



            closeModal('registerModal');
            showNotification('Account created successfully! You are now logged in.', 'success');

            updateAuthButtons(true);

            this.reset();
        });
    }

    const requestForm = document.getElementById('requestForm');
    if (requestForm) {
        requestForm.addEventListener('submit', function (e) {
            e.preventDefault();

            closeModal('requestModal');
            showNotification('Food request sent! The donor will be notified.', 'success');


            this.reset();
        });
    }
}

function updateAuthButtons(isLoggedIn) {
    const authButtons = document.querySelector('.auth-buttons');

    if (isLoggedIn) {
        authButtons.innerHTML = `
<a href="#" id="userMenu" style="display:flex; align-items:center;">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;">
<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
<circle cx="12" cy="7" r="4"></circle>
</svg>
My Account
</a>
<a href="#" id="logoutBtn">Logout</a>
`;

        document.getElementById('logoutBtn').addEventListener('click', function (e) {
            e.preventDefault();
            updateAuthButtons(false);
            showNotification('You have been logged out.', 'info');
        });
    } else {
        authButtons.innerHTML = `
<a href="#" class="signin" onclick="openModal('loginModal')">Sign In</a>
<a href="#" class="signup" onclick="openModal('registerModal')">Sign Up</a>
`;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.textContent = message;

    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '9999';
    notification.style.maxWidth = '300px';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';


    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#F44336';
        notification.style.color = 'white';
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#FF9800';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = '#2196F3';
        notification.style.color = 'white';
    }

    document.body.appendChild(notification);

    setTimeout(function () {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(function () {
            document.body.removeChild(notification)
        }, 500);
    }, 3000);
}

const searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const query = document.getElementById('searchInput').value;

        showNotification(`Searching for "${query}"...`, 'info');
    })
}

function requestFood(foodId, foodTitle) {
    openModal('requestModal')

    document.getElementById('requestFoodTitle').textContent = foodTitle;
    document.getElementById('foodIdInput').value = foodId;
}
