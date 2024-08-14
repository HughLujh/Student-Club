// function openPopupWin() {
//     if (window.confirm("Would you like to RSVP to this event?")) {
//         // do things in database to rsvp this member to this event
//         alert("You have successfully RSVPed to this event.");

//     }
// }

function RSVP(id) {
    let xhttp = new XMLHttpRequest();
    let clubId = document.getElementsByClassName('e_title')[0].id;

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // document.getElementById(id).innerText = 'Leave';
            window.location.reload();
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/RSVPEvent?id=" + encodeURIComponent(id), true);
    xhttp.send();
}

function Leave(id) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            window.location.reload();
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/LeaveEvent?id=" + encodeURIComponent(id), true);
    xhttp.send();
}

function RSVPDisplay() {

    let xhttp = new XMLHttpRequest();
    let id = document.getElementById('btn').className;

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            if (this.responseText[1] == true) {
                document.getElementById('btn').style.display = 'none';
                document.getElementById('leave-btn').style.display = 'block';
            } else {
                document.getElementById('btn').style.display = 'block';
                document.getElementById('leave-btn').style.display = 'none';
            }
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            document.getElementById('btn').style.display = 'block';
            document.getElementById('leave-btn').style.display = 'none';
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/ShowRSVPOrLeave?id=" + encodeURIComponent(id), true);
    xhttp.send();
}


function noButtons() {

    let xhttp = new XMLHttpRequest();
    let id = document.getElementById('btn').className;

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            if (this.responseText[1] == true) {
                document.getElementById('btn').style.display = 'none';
                document.getElementById('leave-btn').style.display = 'none';
            } else {
                RSVPDisplay();
            }
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            document.getElementById('btn').style.display = 'block';
            document.getElementById('leave-btn').style.display = 'none';
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/NoButtonDisplay?id=" + encodeURIComponent(id), true);
    xhttp.send();
}