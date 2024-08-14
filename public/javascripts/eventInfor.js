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

    for (let i = 0; i < elements.length; i++) {
        elements[i].tabIndex = 0;
    }

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
    const location = document.getElementById('e_location');
    const time = document.getElementById('e_time');
    const phone = document.getElementById('coor_phone');

    title.rows = 1;
    title.rows = Math.ceil(title.scrollHeight / title.clientHeight);
    content.rows = 1;
    content.rows = Math.ceil(content.scrollHeight / content.clientHeight);
    location.rows = 1;
    location.rows = Math.ceil(location.scrollHeight / location.clientHeight);
    time.rows = 1;
    time.rows = Math.ceil(time.scrollHeight / time.clientHeight);
    phone.rows = 1;
    phone.rows = Math.ceil(phone.scrollHeight / phone.clientHeight);
}

function loadInforRequest() {
    var currentUrl = window.location.href;
    var path = currentUrl.split('/');

    let id = path[4];
    let eid = path[6];

    let req = new XMLHttpRequest();
    req.open('GET', '/clubs/' + encodeURIComponent(id) + '/events/' + encodeURIComponent(eid) + '/edit');
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            // window.location.assign('/clubs/' + encodeURIComponent(id) + '/events/' + encodeURIComponent(eid) + '/edit');
        } else if (req.readyState === 4 && req.status === 401) {
            alert("FAILED to get the page, please try again!");
        } else if (req.readyState === 4) {
            alert("Error occured, please try again later!");
        }
    };
    req.send();
}

function edit_text() {
    const btn_change_text = document.getElementById('change_text');
    const btn_edit_text = document.getElementById('btn_edit');

    const title = document.getElementById('e_title_name');
    const content = document.getElementById('e_content');
    const location = document.getElementById('e_location');
    const time = document.getElementById('e_time');
    const phone = document.getElementById('coor_phone');


    if (btn_edit_text.innerText === "Edit information") {
        title.removeAttribute("readonly");
        content.removeAttribute("readonly");
        location.removeAttribute("readonly");
        time.removeAttribute("readonly");
        phone.removeAttribute("readonly");

        btn_change_text.style.display = 'block';
        btn_edit_text.innerText = "Cancel editing";
    } else {
        title.setAttribute("readonly", true);
        content.setAttribute("readonly", true);
        location.setAttribute("readonly", true);
        time.setAttribute("readonly", true);
        phone.setAttribute("readonly", true);


        btn_change_text.style.display = 'none';
        btn_edit_text.innerText = "Edit information";
        loadInforRequest();
    }
    autoResize();
}

// more work here to get the old text from the server
function cancel_change() {
    var currentUrl = window.location.href;
    var path = currentUrl.split('/');

    let id = path[4];
    let eid = path[6];

    window.location.assign('/clubs/' + encodeURIComponent(id) + '/events/' + encodeURIComponent(eid) + '/edit');
    // auto resize the text area
    autoResize();
}

// more work here to save the change and send it to the server
//ID needs to be acquired so that corret database table is updated
//either that or by title (make it unique)
function save_change() {
    const btn_change_text = document.getElementById('change_text');
    const btn_edit_text = document.getElementById('btn_edit');

    const title = document.getElementById('e_title_name');
    const content = document.getElementById('e_content');
    const location = document.getElementById('e_location');
    const time = document.getElementById('e_time');
    const phone = document.getElementById('coor_phone');

    title.setAttribute("readonly", true);
    content.setAttribute("readonly", true);
    location.setAttribute("readonly", true);
    time.setAttribute("readonly", true);
    phone.setAttribute("readonly", true);

    btn_change_text.style.display = 'none';
    btn_edit_text.innerText = "Edit information";

    // auto resize the text area
    autoResize();
}


