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
    var elements = document.querySelectorAll("#mainBody *:not(br):not(h1):not(header):not(div):not(tr):not(th):not([hidden]):not(tr[hidden] *):not(td):not(table):not(tbody):not([type='checkbox']):not([class='slider round']):not([class='fas fa-search'])");
    for (let i = 0; i < elements.length; i++) {
        elements[i].tabIndex = 0;
    }
}



// function preSetNoti() {
//     const formatDivs = document.querySelectorAll('.format');

//     formatDivs.forEach((formatDiv) => {
//         const onNoti = formatDiv.querySelector('.on_noti');
//         const offNoti = formatDiv.querySelector('.off_noti');

//         onNoti.addEventListener('click', () => {
//             onNoti.classList.add('hidden');
//             offNoti.classList.remove('hidden');
//         });

//         offNoti.addEventListener('click', () => {
//             offNoti.classList.add('hidden');
//             onNoti.classList.remove('hidden');
//         });
//         offNoti.classList.add('hidden');
//         onNoti.classList.remove('hidden');
//     });
// }

// function change_visibility(clubname) {
//     // const club_show_hide = document.getElementById(clubname.id);
//     let post = clubname.id + "_post";
//     const club_post = document.getElementById(post);
//     let event = clubname.id + "_event";
//     const club_event = document.getElementById(event);


//     club_event.toggleAttribute("hidden");
//     club_post.toggleAttribute("hidden");
//     removeTabIndex();
//     tabindex();
//     // addEnterKey();
// }

// function changNoti(element) {
//     const trElement = element.closest('tr');
//     console.log("-----------start-------------");
//     console.log(trElement.id);
//     console.log(element.classList);
//     console.log("-----------end-------------");
// }


// eslint-disable-next-line no-new
new Vue({
    el: '#mainBody',
    data() {
        return {
            userEmail: '',
            allClubList: [],
            searchItems: '',
            matchItems: [],
            normalItems: true
        };
    },
    mounted() {
        const self = this;
        let req = new XMLHttpRequest();
        req.open('GET', '/get_user_email');
        req.setRequestHeader('Content-Type', 'application/json');
        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                self.userEmail = req.response;
            } else if (req.readyState === 4 && req.status === 401) {
                alert("change FAILED, please try again!");
            } else if (req.readyState === 4) {
                alert("Error occured, please try again later!");
            }
        };
        req.send();

        let req2 = new XMLHttpRequest();
        req2.open('GET', '/notification_setting_load');
        req2.setRequestHeader('Content-Type', 'application/json');
        req2.onreadystatechange = function () {
            if (req2.readyState === 4 && req2.status === 200) {
                self.allClubList = JSON.parse(req2.response);
            } else if (req2.readyState === 4 && req2.status === 401) {
                alert("change FAILED, please try again!");
            } else if (req2.readyState === 4) {
                alert("Error occured, please try again later!");
            }
        };
        req2.send();

        self.allClubList.forEach((element) => {
            let club_id = element.clubid;
            let club = document.getElementById(club_id);
            club.addEventListener("mouseover", function () {
                club.style.cursor = "pointer";
                club.setAttribute("data-attribute", "attribute-value");
            });
            let post = club_id + "_post";
            const club_post = document.getElementById(post);
            let event = club_id + "_event";
            const club_event = document.getElementById(event);
            club_post.setAttribute("hidden", true);
            club_event.setAttribute("hidden", true);
        });

    },
    methods: {
        changeNoti(clubid, type, status) {
            const self = this;
            let data = {};
            if (type === "all") {
                data = {
                    clubId: clubid,
                    all: status
                };
            } else if (type === "event") {
                data = {
                    clubId: clubid,
                    event: status
                };
            } else if (type === "post") {
                data = {
                    clubId: clubid,
                    post: status
                };
            } else {
                alert("Error Occurred, please try again later!");
            }
            let req = new XMLHttpRequest();
            req.open('POST', '/notification_setting_change');
            req.setRequestHeader('Content-Type', 'application/json');
            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    self.allClubList = JSON.parse(req.response);
                } else if (req.readyState === 4 && req.status === 401) {
                    alert("Changes FAILED, please try again!");
                } else if (req.readyState === 4) {
                    alert("Error occured, please try again later!");
                }
            };
            req.send(JSON.stringify(data));
        },
        changeVisibility(clubid) {
            let post = clubid + "_post";
            const club_post = document.getElementById(post);
            let event = clubid + "_event";
            const club_event = document.getElementById(event);
            club_event.toggleAttribute("hidden");
            club_post.toggleAttribute("hidden");
            removeTabIndex();
            tabindex();
        },
        getClubs() {
            const self = this;
            const req = new XMLHttpRequest();
            if (self.searchItems === '') {
                req.open('GET', `/clubs_search`);
            } else {
                req.open('GET', `/clubs_search?q=${this.searchItems}`);
            }

            req.onload = function () {
                if (req.readyState === 4 && req.status === 200) {
                    self.matchItems = JSON.parse(req.response);
                    self.normalItems = false;
                } else if (req.readyState === 4 && req.status === 500) {
                    alert("Failed to find the clubs, please try again!");
                } else if (req.readyState === 4) {
                    alert("Error occurred, please try again later!");
                }
            };
            req.send();
        }

    }
});


