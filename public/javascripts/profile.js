function addEnterKey() {
    var elements = document.querySelectorAll("[tabindex]");

    elements.forEach(function (element) {
        element.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                element.click();
            }
        });
    });
}

function removeTabIndex() {
    const elements = document.querySelectorAll('[tabindex]');
    elements.forEach((element) => {
        element.removeAttribute('tabindex');
    });
}
function tabindex() {
    var elements = document.querySelectorAll("#mainBody *:not(br):not(header):not(div):not([hidden]):not(tr[hidden] *):not(tbody):not([type='checkbox']):not([class='slider round']):not([class='fas fa-search']):not(form):not([style*='display:none'] *):not(img):not([class='avatar-text'])");
    for (let i = 0; i < elements.length; i++) {
        elements[i].tabIndex = 0;
    }
    const avatarDiv = document.querySelector('.avatar-container');
    avatarDiv.setAttribute('tabindex', '0');
}
function autoResize() {
    const username = document.getElementById('username');
    const contact_text = document.getElementById('contact_text');
    const bio_text = document.getElementById('bio_text');

    username.rows = 1;
    username.rows = Math.ceil(username.scrollHeight / username.clientHeight);
    contact_text.rows = 1;
    contact_text.rows = Math.ceil(contact_text.scrollHeight / contact_text.clientHeight);
    bio_text.rows = 1;
    bio_text.rows = Math.ceil(bio_text.scrollHeight / bio_text.clientHeight);
}

function profile_submit() {
    let fileInput = document.getElementById("avatar-input");
    let profile_pic = document.getElementById("profile_pic");
    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append("avatar", file);

    let req = new XMLHttpRequest();
    req.open('POST', '/profile_submit');
    // req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            profile_pic.src = JSON.parse(req.response);
        } else if (req.readyState === 4 && req.status === 401) {
            alert("Change failed, please try again!");
        } else if (req.readyState === 4) {
            alert("Error occurred, please try again later!");
        }
    };
    req.send(formData);
}

function saveChanges() {
    let data = {
        username: document.getElementById('username').value,
        contact: document.getElementById('contact_text').value,
        biography: document.getElementById('bio_text').value,
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById("lastname").value,
        password: ''
    };
    let passElement = document.getElementById("pass_text");
    if (passElement) {
        data.password = passElement.value;
        let asterisks = '*'.repeat(18);
        passElement.value = asterisks;
    } else {
        delete data.password;
    }

    let req = new XMLHttpRequest();
    req.open('POST', '/profile_info_submit');
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            alert("Changes saved!");
        } else if (req.readyState === 4 && req.status === 401) {
            alert("change FAILED, please try again!");
        } else if (req.readyState === 4 && req.status === 402) {
            document.getElementById('username').value = req.responseText;
            alert("Username has been taken, please try another one!");
        } else if (req.readyState === 4) {
            alert("Error occured, please try again later!");
        }
    };
    req.send(JSON.stringify(data));
}

function loadInfor() {
    const username = document.getElementById('username');
    const contact_text = document.getElementById('contact_text');
    const bio_text = document.getElementById('bio_text');
    const profile_pic = document.getElementById("profile_pic");
    const firstname = document.getElementById('firstname');
    const lastname = document.getElementById("lastname");
    let req = new XMLHttpRequest();
    req.open('GET', '/profile_load');
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let infor = JSON.parse(req.response);
            bio_text.value = infor.biography;
            contact_text.value = infor.contact;
            username.value = infor.username;
            profile_pic.src = infor.profile_picture;

            firstname.value = infor.firstname;
            lastname.value = infor.lastname;
            if (infor.type === "normal") {
                const btnDiv = document.getElementById("change_text");
                var spanElement = document.createElement('span');
                var newline = document.createElement('br');
                var newline2 = document.createElement('br');

                var textElement = document.createElement('textarea');

                spanElement.className = 'e_title';
                spanElement.textContent = 'Change Your Password:';


                textElement.id = 'pass_text';
                textElement.rows = '1';
                textElement.className = 'p_text';
                textElement.type = 'password';
                textElement.readOnly = true;
                textElement.maxLength = '18';

                btnDiv.parentNode.insertBefore(spanElement, btnDiv);
                btnDiv.parentNode.insertBefore(newline, btnDiv);
                btnDiv.parentNode.insertBefore(textElement, btnDiv);
                btnDiv.parentNode.insertBefore(newline2, btnDiv);
                let asterisks = '*'.repeat(18);
                textElement.placeholder = asterisks;
            }
        } else if (req.readyState === 4 && req.status === 401) {
            alert("FAILED to get the page, please try again!");
        } else if (req.readyState === 4) {
            alert("Error occured, please try again later!");
        }
    };
    req.send();
}

function cancelChange() {
    const username = document.getElementById('username');
    const contact_text = document.getElementById('contact_text');
    const bio_text = document.getElementById('bio_text');
    const profile_pic = document.getElementById("profile_pic");
    const firstname = document.getElementById('firstname');
    const lastname = document.getElementById("lastname");

    let passElement = document.getElementById("pass_text");
    if (passElement) {
        let asterisks = '*'.repeat(18);
        passElement.value = asterisks;
    }
    let req = new XMLHttpRequest();
    req.open('GET', '/profile_cancel');
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let infor = JSON.parse(req.response);
            bio_text.value = infor.biography;
            contact_text.value = infor.contact;
            username.value = infor.username;
            profile_pic.src = infor.profile_picture;

            firstname.value = infor.firstname;
            lastname.value = infor.lastname;
        } else if (req.readyState === 4 && req.status === 401) {
            alert("FAILED to get the page, please try again!");
        } else if (req.readyState === 4) {
            alert("Error occured, please try again later!");
        }
    };
    req.send();
}
function changeToRead(action) {
    const btn_change_text = document.getElementById('change_text');
    const btn_edit_text = document.getElementById('btn_edit');
    const textElements = document.getElementsByClassName('p_text');

    if (action === "read") {
        for (let i = 0; i < textElements.length; i++) {
            textElements[i].setAttribute("readonly", true);
        }
        btn_change_text.style.display = 'none';
        btn_edit_text.innerText = "Edit profile";
    } else if (action === "write") {
        for (let i = 0; i < textElements.length; i++) {
            textElements[i].removeAttribute("readonly");
        }
        let passElement = document.getElementById("pass_text");
        if (passElement) {
            passElement.value = '';
        }

        btn_change_text.style.display = 'block';
        btn_edit_text.innerText = "Cancel editing";
    } else {
        alert("Error occurred, please try again later");
    }
}


function edit_text() {
    const btn_edit_text = document.getElementById('btn_edit');

    if (btn_edit_text.innerText === "Edit profile") {
        changeToRead("write");
    } else {
        changeToRead("read");
        cancelChange();
    }
    autoResize();
    removeTabIndex();
    tabindex();
}


function cancel_change() {
    changeToRead("read");
    cancelChange();
    // auto resize the text area
    autoResize();
    removeTabIndex();
    tabindex();
}


function save_change() {
    changeToRead("read");
    saveChanges();

    // auto resize the text area
    autoResize();
    removeTabIndex();
    tabindex();
}


function enterNewLine(event) {
    if (event.keyCode === 13) {
        if (event.keyCode === 13) {
            this.myText += "\n";
        }
    }
}
