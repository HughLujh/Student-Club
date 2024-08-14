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
    const elements = document.querySelectorAll("#mainBody *:not(br):not(header):not(i):not(li):not(div):not([hidden]):not(tr[hidden] *):not(tbody):not([type='checkbox']):not([class='slider round']):not([class='fas fa-search']):not(form):not([style*='display:none'] *):not(img):not([class='avatar-text'])");
    const popup = document.querySelector("#email_content");
    const avatarDiv = document.querySelector('.avatar-container');
    for (let i = 0; i < elements.length; i++) {
        elements[i].tabIndex = 0;
    }

    avatarDiv.setAttribute('tabindex', '0');
    popup.tabIndex = 0;
}

function change_btn_text() {
    const btn_change_text = document.getElementById('btn_select');
    var checkboxes = document.querySelectorAll(".checkbox");
    if (btn_change_text.innerText === "Select All") {
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
        }
        btn_change_text.innerText = "Cancel Select";
    } else {
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
        btn_change_text.innerText = "Select All";
    }
}


function autoResize() {
    const title = document.getElementById('e_title_name');
    const content = document.getElementById('e_content');
    const category = document.getElementById('e_category');
    const location = document.getElementById('e_location');
    const email = document.getElementById('coor_email');
    const phone = document.getElementById('coor_phone');

    title.rows = 1;
    title.rows = Math.ceil(title.scrollHeight / title.clientHeight);
    content.rows = 1;
    content.rows = Math.ceil(content.scrollHeight / content.clientHeight);
    category.rows = 1;
    category.rows = Math.ceil(category.scrollHeight / category.clientHeight);
    location.rows = 1;
    location.rows = Math.ceil(location.scrollHeight / location.clientHeight);
    email.rows = 1;
    email.rows = Math.ceil(email.scrollHeight / email.clientHeight);
    phone.rows = 1;
    phone.rows = Math.ceil(phone.scrollHeight / phone.clientHeight);
}
// more work here to get the old text from the server
function edit_text() {
    const btn_change_text = document.getElementById('change_text');
    const btn_edit_text = document.getElementById('btn_edit');

    const title = document.getElementById('e_title_name');
    const content = document.getElementById('e_content');
    const category = document.getElementById('e_category');
    const location = document.getElementById('e_location');
    const email = document.getElementById('coor_email');
    const phone = document.getElementById('coor_phone');


    if (btn_edit_text.innerText === "Edit information") {
        title.removeAttribute("readonly");
        content.removeAttribute("readonly");
        category.removeAttribute("readonly");
        location.removeAttribute("readonly");
        email.removeAttribute("readonly");
        phone.removeAttribute("readonly");

        btn_change_text.style.display = 'block';
        btn_edit_text.innerText = "Cancel editing";
    } else {
        title.setAttribute("readonly", true);
        content.setAttribute("readonly", true);
        category.setAttribute("readonly", true);
        location.setAttribute("readonly", true);
        email.setAttribute("readonly", true);
        phone.setAttribute("readonly", true);


        btn_change_text.style.display = 'none';
        btn_edit_text.innerText = "Edit information";
    }
    autoResize();
}

// more work here to get the old text from the server
function cancel_change() {
    const btn_change_text = document.getElementById('change_text');
    const btn_edit_text = document.getElementById('btn_edit');

    const title = document.getElementById('e_title_name');
    const content = document.getElementById('e_content');
    const category = document.getElementById('e_category');
    const location = document.getElementById('e_location');
    const email = document.getElementById('coor_email');
    const phone = document.getElementById('coor_phone');

    title.setAttribute("readonly", true);
    content.setAttribute("readonly", true);
    category.setAttribute("readonly", true);
    location.setAttribute("readonly", true);
    email.setAttribute("readonly", true);
    phone.setAttribute("readonly", true);

    btn_change_text.style.display = 'none';
    btn_edit_text.innerText = "Edit information";

    // auto resize the text area
    autoResize();
}

// more work here to save the change and send it to the server
function save_change() {
    const btn_change_text = document.getElementById('change_text');
    const btn_edit_text = document.getElementById('btn_edit');


    const title = document.getElementById('e_title_name');
    const content = document.getElementById('e_content');
    const category = document.getElementById('e_category');
    const location = document.getElementById('e_location');
    const email = document.getElementById('coor_email');
    const phone = document.getElementById('coor_phone');

    title.setAttribute("readonly", true);
    content.setAttribute("readonly", true);
    category.setAttribute("readonly", true);
    location.setAttribute("readonly", true);
    email.setAttribute("readonly", true);
    phone.setAttribute("readonly", true);

    btn_change_text.style.display = 'none';
    btn_edit_text.innerText = "Edit information";

    // auto resize the text area
    autoResize();
}



function closePopupWin() {
    document.querySelector("#popup").style.display = "none";
}
function closePopupEsc(event) {
    const popup = document.querySelector("#popup");
    if (event.key === "Escape") {
        closePopupWin();
        popup.removeEventListener("keydown", closePopupEsc);
    }
}

function openPopupWin() {
    const popup = document.querySelector("#popup");
    const popupWin = document.querySelector("#email_content");
    popup.style.display = "block";
    popupWin.focus();
    popup.addEventListener("keydown", closePopupEsc);
}

