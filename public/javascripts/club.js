// contact us
function sendEmail() {
    var currentURL = window.location.href;
    var path = currentURL.split("/")[4];
    var number = parseInt(path, 10);
    let data = {
        title: document.getElementById("emailTitle").value,
        clubId: number,
        content: document.getElementById("emailContent").value,
        email: ''
    };
    let emailElement = document.getElementById("emailSender");
    if (emailElement) {
        data.email = emailElement.value;
    } else {
        delete data.email;
    }
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/sendEmailToManager");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            alert("Email is sent successfully!");
        } else if (xhttp.readyState === 4) {
            alert("Error occured, please try agin later!");

        }
    };

    xhttp.send(JSON.stringify(data));
}

function editInfoForEvents(id, eid) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            window.location.assign("/clubs/" + encodeURIComponent(id) + '/events/' + encodeURIComponent(eid) + '/edit');
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/clubs/" + encodeURIComponent(id) + '/events/' + encodeURIComponent(eid) + '/edit', true);
    xhttp.send();
}

// end

function showSidebar() {
    document.getElementById("sidebar").style.display = 'block';
    // document.getElementById("menu-btn").style.display = 'none';
    document.getElementById("menu-btn").setAttribute('onclick', "closeSidebar()");

}

function closeSidebar() {
    // document.getElementById("menu-btn").style.display = 'block';
    document.getElementById("sidebar").style.display = 'none';
    document.getElementById("menu-btn").setAttribute('onclick', "showSidebar()");
}

// function editDisplay(id) {

//     let xhttp = new XMLHttpRequest();

//     xhttp.onreadystatechange = function () {
//         if (xhttp.readyState === 4 && xhttp.status === 200) {
//             let response = JSON.parse(this.responseText);

//             if (response.length === 0) {
//                 document.getElementsByClassName('edit-btn')[0].style.display = 'none';
//                 document.getElementById('add-new-member').style.display = 'none';
//                 document.getElementById('add-new-event').style.display = 'none';
//                 document.getElementById('onlyManager').style.display = 'none';
//                 document.getElementById('onlyManager2').style.display = 'none';

//                 const moreInfo = document.querySelectorAll('.onlyManager4');
//                 moreInfo.forEach((btn) => {
//                     let b = btn;
//                     b.style.display = 'block';
//                 });

//                 const editInfo = document.querySelectorAll('.onlyManager3');
//                 editInfo.forEach((btn) => {
//                     let b = btn;
//                     b.style.display = 'none';
//                 });
//                 return;
//             }

//             [response] = response;

//             if (response.role === 'manager' && toString(response.club_id) === toString(id)) {
//                 document.getElementsByClassName('edit-btn')[0].style.display = 'block';
//                 document.getElementById('add-new-member').style.display = 'block';
//                 document.getElementById('add-new-event').style.display = 'block';
//                 document.getElementById('onlyManager').style.display = 'block';
//                 document.getElementById('onlyManager2').style.display = 'block';

//                 const moreInfo = document.querySelectorAll('.onlyManager4');
//                 moreInfo.forEach((btn) => {
//                     let b = btn;
//                     b.style.display = 'none';
//                 });

//                 const editInfo = document.querySelectorAll('.onlyManager3');
//                 editInfo.forEach((btn) => {
//                     let b = btn;
//                     b.style.display = 'block';
//                 });
//             } else {
//                 document.getElementsByClassName('edit-btn')[0].style.display = 'none';
//                 document.getElementById('add-new-member').style.display = 'none';
//                 document.getElementById('add-new-event').style.display = 'none';
//                 document.getElementById('onlyManager').style.display = 'none';
//                 document.getElementById('onlyManager2').style.display = 'none';

//                 const moreInfo = document.querySelectorAll('.onlyManager4');
//                 moreInfo.forEach((btn) => {
//                     let b = btn;
//                     b.style.display = 'block';
//                 });

//                 const editInfo = document.querySelectorAll('.onlyManager3');
//                 editInfo.forEach((btn) => {
//                     let b = btn;
//                     b.style.display = 'none';
//                 });
//             }
//         }
//     };

//     xhttp.open("GET", "/editDisplay?id=" + encodeURIComponent(id), true);
//     xhttp.send();
// }

function joinDisplay(id, m) {
    if (m) {
        return;
    }
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            if (this.responseText[1] == true) {
                document.getElementById('join_btn').style.display = 'none';
                document.getElementById('leave_btn').style.display = 'block';
            } else {
                document.getElementById('join_btn').style.display = 'block';
                document.getElementById('leave_btn').style.display = 'none';
            }
        }
    };

    xhttp.open("GET", "/joinDisplay?id=" + encodeURIComponent(id), true);
    xhttp.send();

}

function RSVPDisplay() {
    let RSVPButtons = document.getElementsByClassName('RSVP-OR-LEAVE');

    for (let i = 0; i < RSVPButtons.length; i += 2) {
        let { id } = RSVPButtons[i];
        let AJAXid = id.slice(5);

        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                if (this.responseText[1] == true) {
                    document.getElementById(id).style.display = 'none';
                    document.getElementById(id + 'pt2').style.display = 'block';
                } else {
                    document.getElementById(id).style.display = 'block';
                    document.getElementById(id + 'pt2').style.display = 'none';
                }
            } else if (xhttp.readyState === 4 && xhttp.status === 400) {
                document.getElementById(id).style.display = 'block';
                document.getElementById(id + 'pt2').style.display = 'none';
                window.location.assign('/login');
            }
        };

        xhttp.open("GET", "/ShowRSVPOrLeave?id=" + encodeURIComponent(AJAXid), true);
        xhttp.send();
    }

}

function showHome(id, m) {
    const cs = document.querySelectorAll(".club-section");
    cs.forEach((s) => {
        let section = s;
        section.style.display = 'none';
    });
    document.getElementById('home-layout').style.display = 'block';
    document.getElementById("club-info").style.display = 'flex';
    // document.getElementById("members-layout").style.display = 'none';
    // document.getElementById("event-layout").style.display = 'none';
    // document.getElementById("club-posts").style.display = 'none';
    // document.getElementById("contact-us").style.display = 'none';

    document.getElementById("list-of-members").style.display = 'none';
    closeSidebar();
    joinDisplay(id, m);
    // editDisplay(id);
    RSVPDisplay();
}

function showCommittee() {
    const cs = document.querySelectorAll(".club-section");
    cs.forEach((s) => {
        let section = s;
        section.style.display = 'none';
    });
    // document.getElementById('home-layout').style.display = 'none';
    // document.getElementById("club-info").style.display = 'none';
    document.getElementById("members-layout").style.display = 'block';
    // document.getElementById("event-layout").style.display = 'none';
    // document.getElementById("club-posts").style.display = 'none';
    // document.getElementById("contact-us").style.display = 'none';
    // document.getElementById("list-of-members").style.display = 'none';
    closeSidebar();
}

function showEvents() {
    const cs = document.querySelectorAll(".club-section");
    cs.forEach((s) => {
        let section = s;
        section.style.display = 'none';
    });
    // document.getElementById('home-layout').style.display = 'none';
    // document.getElementById("club-info").style.display = 'none';
    // document.getElementById("members-layout").style.display = 'none';
    document.getElementById("event-layout").style.display = 'block';
    // document.getElementById("club-posts").style.display = 'none';
    // document.getElementById("contact-us").style.display = 'none';
    // document.getElementById("list-of-members").style.display = 'none';
    closeSidebar();
}

function showPosts() {
    const cs = document.querySelectorAll(".club-section");
    cs.forEach((s) => {
        let section = s;
        section.style.display = 'none';
    });
    // document.getElementById('home-layout').style.display = 'none';
    // document.getElementById("club-info").style.display = 'none';
    // document.getElementById("members-layout").style.display = 'none';
    // document.getElementById("event-layout").style.display = 'none';
    document.getElementById("club-posts").style.display = 'block';
    // document.getElementById("contact-us").style.display = 'none';
    // document.getElementById("list-of-members").style.display = 'none';
    closeSidebar();
}

function showContact() {
    const cs = document.querySelectorAll(".club-section");
    cs.forEach((s) => {
        let section = s;
        section.style.display = 'none';
    });
    // document.getElementById('home-layout').style.display = 'none';
    // document.getElementById("club-info").style.display = 'none';
    // document.getElementById("members-layout").style.display = 'none';
    // document.getElementById("event-layout").style.display = 'none';
    // document.getElementById("club-posts").style.display = 'none';
    document.getElementById("contact-us").style.display = 'block';
    // document.getElementById("list-of-members").style.display = 'none';
    closeSidebar();
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            if (xhttp.responseText === "guest") {
                let emailSender = document.createElement("input");
                emailSender.type = "email";
                emailSender.placeholder = "YOUR EMAIL";
                emailSender.name = "email";
                emailSender.className = "contact-form-inputs";
                emailSender.required = true;
                emailSender.id = "emailSender";

                const email = document.getElementById("emailTitle");
                email.parentNode.insertBefore(emailSender, email.nextSibling);

            }
        } else if (xhttp.readyState === 4 && xhttp.status === 401) {
            alert("Error Occurred, please try again later!");
        }
    };

    xhttp.open("GET", "/role.type", true);
    xhttp.send();
}

function showMembers() {
    const cs = document.querySelectorAll(".club-section");
    cs.forEach((s) => {
        let section = s;
        section.style.display = 'none';
    });
    // document.getElementById('home-layout').style.display = 'none';
    // document.getElementById("club-info").style.display = 'none';
    // document.getElementById("members-layout").style.display = 'none';
    // document.getElementById("event-layout").style.display = 'none';
    // document.getElementById("club-posts").style.display = 'none';
    // document.getElementById("contact-us").style.display = 'none';
    document.getElementById("list-of-members").style.display = 'block';
    closeSidebar();
}

let count = 0;
function newMember(id) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {

            let response = JSON.parse(this.responseText);

            if (response.length < 1) {
                alert("No new members to select");
            } else {
                // creating the outermost div and appending it to the body tag
                let outermostDiv = document.createElement('DIV');
                outermostDiv.classList.add("popup");
                outermostDiv.style.display = 'flex';
                document.body.appendChild(outermostDiv);

                // creating the inner div to add the form elements
                // and appending it to the outermost div tag
                let innerDiv = document.createElement('DIV');
                innerDiv.classList.add("popup-content");
                outermostDiv.appendChild(innerDiv);

                // creating the closing button for the div
                let closeButton = document.createElement('SPAN');
                closeButton.classList.add("close-for-popup");
                closeButton.innerHTML = "&times;";
                closeButton.onclick = function () {
                    document.getElementsByClassName("popup")[count].style.display = "none";
                    count++;
                };
                innerDiv.appendChild(closeButton);

                // creating the form element and appending it to the inner div
                let form = document.createElement('FORM');
                form.classList.add('popup-form');
                form.setAttribute('action', '/clubs/' + encodeURIComponent(id) + '/addNewManager');
                form.setAttribute('method', 'post');
                // form.setAttribute('enctype', 'multipart/form-data');
                innerDiv.appendChild(form);

                // Create a hidden input field for id
                // (note that editing this id won't allow managers to edit other clubs)
                var idValueInput = document.createElement('input');
                idValueInput.type = 'hidden';
                idValueInput.name = 'id';
                idValueInput.value = id;

                // Append hidden input to form
                form.appendChild(idValueInput);

                let member = document.createElement('SELECT');
                member.setAttribute('required', '');
                member.setAttribute('name', 'newManager');
                member.classList.add('input-forms');

                let option0 = document.createElement('OPTION');
                option0.setAttribute('disabled', '');
                option0.setAttribute('selected', '');
                option0.setAttribute('hidden', '');
                option0.innerText = 'Add a new manager';

                for (var res of response) {
                    let option1 = document.createElement('OPTION');
                    option1.setAttribute('value', res.user_email);
                    option1.innerText = res.user_email;

                    member.appendChild(option1);
                }

                form.appendChild(member);

                // creating a submit button and appending it to the form
                let submitButton = document.createElement('INPUT');
                submitButton.setAttribute('type', 'submit');
                submitButton.setAttribute('value', 'Submit');
                submitButton.classList.add('submit-btn');

                form.appendChild(submitButton);
            }
        }
    };

    xhttp.open("GET", "/clubs/" + encodeURIComponent(id) + "/addManagers", true);
    xhttp.send();
}

function edit(updatedText, id) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            window.location(encodeURIComponent(id));
        }
    };

    xhttp.open("POST", "/clubs/" + encodeURIComponent(id) + "/editDesc", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // let data = {"update": updatedText};
    xhttp.send(JSON.stringify({ updatedText: updatedText, id: id }));
}

function editInformation(id) {
    let contents = document.getElementById("info").innerText;
    document.getElementById('info').style.display = "none";

    document.getElementsByClassName("club-btn")[0].style.display = 'none';
    document.getElementsByClassName("club-btn")[1].style.display = 'none';


    let textArea = document.createElement('TEXTAREA');
    textArea.setAttribute('rows', '10');
    textArea.setAttribute('cols', '50');
    textArea.style.backgroundColor = "white";
    textArea.style.color = "black";
    textArea.classList.add('info');
    textArea.setAttribute('name', 'edited-club-info');
    textArea.innerText = contents;

    document.getElementsByClassName("edit-btn")[0].style.display = "none";

    let save = document.createElement("BUTTON");
    save.innerText = "Save";
    save.classList.add("edit-btn");
    save.type = "button";
    save.onclick = function () {
        save.style.display = 'none';
        let newContent = textArea.value;
        textArea.remove();

        document.getElementById('info').innerText = newContent;
        document.getElementById('info').style.display = "block";

        document.getElementsByClassName("club-btn")[1].style.display = 'block';
        document.getElementsByClassName("edit-btn")[0].style.display = "block";
        edit(newContent, id);
    };

    let parent = document.getElementById('edit-bundle-para');
    parent.appendChild(textArea);
    parent.appendChild(save);
}

function getPostDate() {
    var date = new Date();
    date = date.toLocaleDateString();

    var time = new Date();
    var hours = time.getHours();
    var mins = time.getMinutes();
    if (hours < 10) {
        hours = "0" + String(hours);
    }
    if (mins < 10) {
        mins = "0" + String(mins);
    }
    time = hours + ":" + mins;

    var finalDate = date + " " + time;
    return finalDate;
}

function moreInfoForEvents(id, clubId) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            window.location.assign(encodeURIComponent(clubId) + '/events/' + encodeURIComponent(id));
        }
    };

    xhttp.open("GET", "/clubs/" + encodeURIComponent(clubId) + '/events/' + encodeURIComponent(id), true);
    xhttp.send();
}

function newEvent(id) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            window.location.assign('/clubs/' + encodeURIComponent(id) + '/events/new');
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/clubs/" + encodeURIComponent(id) + '/events/new', true);
    xhttp.send();
}

function newPost(id) {
    window.open('/clubs/' + encodeURIComponent(id) + "/posts/new", '_blank');
}

const vue_events = new Vue({
    el: '#event-layout',
    data: {
        upcoming: true,
        previous: false
    }
});

function join(id) {
    // if (window.confirm("Are you sure you want to join this club?")) {
    // subscribe this member to the club in database

    //     alert("You have joined the club.");
    // }

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            window.location.assign('/clubs/' + encodeURIComponent(id), "_blank");
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/clubs/" + encodeURIComponent(id) + "/join", true);
    xhttp.send();
}

function leaveClub(id) {
    // if (window.confirm("Are you sure you want to join this club?")) {
    // subscribe this member to the club in database

    //     alert("You have joined the club.");
    // }

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            window.location.assign('/clubs/' + encodeURIComponent(id), "_blank");
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/clubs/" + encodeURIComponent(id) + "/leave", true);
    xhttp.send();
}

function RSVP(id, clubId) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // document.getElementById(id).innerText = 'Leave';
            window.location.assign(encodeURIComponent(clubId));
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/RSVPEvent?id=" + encodeURIComponent(id.slice(5)), true);
    xhttp.send();
}

function Leave(id, clubId) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            window.location.assign(encodeURIComponent(clubId));
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/LeaveEvent?id=" + encodeURIComponent(id), true);
    xhttp.send();
}

function Delete(i, clubId, title) {
    let xhttp = new XMLHttpRequest();
    let id = i.slice(5);

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            window.location.assign(encodeURIComponent(clubId));
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/clubs/" + encodeURIComponent(clubId) + '/events/' + encodeURIComponent(id) + '/delete?title=' + encodeURIComponent(title), true);
    xhttp.send();
}



function loadNotificationButton() {
    var currentURL = window.location.href;
    var path = currentURL.split("/")[4];
    var number = parseInt(path, 10);
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            const response = JSON.parse(xhttp.response);
            if (response === true) {
                document.getElementById('receiveNoti').style.display = 'none';
                document.getElementById('notReceiveNoti').style.display = 'block';
            } else {
                document.getElementById('receiveNoti').style.display = 'block';
                document.getElementById('notReceiveNoti').style.display = 'none';
            }
        }
    };

    xhttp.open("GET", "/loadNotificationButton_set?id=" + encodeURIComponent(number), true);
    xhttp.send();
}

function receiveNotification(id) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            document.getElementById('receiveNoti').style.display = 'none';
            document.getElementById('notReceiveNoti').style.display = 'block';
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        } else if (xhttp.readyState === 4 && xhttp.status === 401) {
            alert("Please join the club first.");
        }
    };

    xhttp.open("GET", "/receiveNotification_set?id=" + encodeURIComponent(id), true);
    xhttp.send();
}

function cancelNotification(id) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            document.getElementById('receiveNoti').style.display = 'block';
            document.getElementById('notReceiveNoti').style.display = 'none';
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        } else if (xhttp.readyState === 4) {
            alert("Error Occurred, please try again later!");
        }
    };

    xhttp.open("GET", "/cancelNotification_set?id=" + encodeURIComponent(id), true);
    xhttp.send();
}

