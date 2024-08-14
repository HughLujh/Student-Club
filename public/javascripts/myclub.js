function closePopup() {
    document.getElementsByClassName('popup')[0].style.display = 'none';
}

function buildPopup(pic, name, description, category1, id) {
    let img = document.createElement('IMG');
    img.setAttribute('src', pic);
    img.setAttribute('alt', 'logo');
    img.classList.add('extra-club-logo');
    img.id = 'remove-after-use';
    document.getElementById('img-logo').appendChild(img);

    document.getElementsByClassName('extra-club-name')[0].innerText = name;
    document.getElementById('desc').innerText = description;
    document.getElementById('categories').innerText = "Categories: " + category1;

    document.getElementsByClassName('new-page')[0].id = id;

    document.getElementsByClassName('popup')[0].style.display = 'flex';

    document.getElementById('close').onclick = function () {
        document.getElementById('img-logo').removeChild(document.getElementById('remove-after-use'));
        closePopup();
    };
}

function removeEverything() {
    const elements = document.getElementsByClassName('club-info');

    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}


let index = 0;
function test() {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            removeEverything();

            let response = JSON.parse(this.responseText);

            var checkboxes = document.getElementsByName('filter');
            var result = [];

            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    result.push(checkboxes[i].value);
                }
            }

            for (let res of response) {

                if (result.includes(res.category1)) {
                    let parent_div = document.createElement('DIV');
                    parent_div.classList.add('club-info');

                    let img_tag = document.createElement('IMG');
                    img_tag.setAttribute('src', res.picture);
                    img_tag.setAttribute('alt', 'logo');
                    img_tag.classList.add('club-logo');
                    parent_div.appendChild(img_tag);

                    let heading_tag = document.createElement('h3');
                    heading_tag.classList.add('club-name');
                    heading_tag.innerText = res.name;
                    parent_div.appendChild(heading_tag);

                    parent_div.style.cursor = 'pointer';

                    document.getElementById('main-content').appendChild(parent_div);

                    parent_div.addEventListener('click', function () {
                        buildPopup(res.picture, res.name, res.description, res.category1, res.id);
                    });

                    document.getElementById('close').onclick = function () {
                        document.getElementById('img-logo').removeChild(document.getElementById('remove-after-use'));
                        closePopup();
                    };
                }
            }
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/displayMyClubs", true);
    xhttp.send();
}

window.onload = function () {
    document.getElementById('filter-btn').classList.remove('filter-btn-active');
    get_nav();
    test();
};

function searchAll() {
    let item = document.getElementById("search").value;
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            removeEverything();

            let response = JSON.parse(this.responseText);

            var checkboxes = document.getElementsByName('filter');
            var result = [];

            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    result.push(checkboxes[i].value);
                }
            }

            let matchItems = [];
            if (item === '') {
                matchItems = response;
            } else {
                for (let res of response) {
                    const itemLower = item.toLowerCase();
                    const nameLower = res.name.toLowerCase();
                    if (nameLower.includes(itemLower)) {
                        matchItems.push(res);
                    }
                }
            }

            for (let res of matchItems) {
                let parent_div = document.createElement('DIV');
                parent_div.classList.add('club-info');

                let img_tag = document.createElement('IMG');
                img_tag.setAttribute('src', res.picture);
                img_tag.setAttribute('alt', 'logo');
                img_tag.classList.add('club-logo');
                parent_div.appendChild(img_tag);

                let heading_tag = document.createElement('h3');
                heading_tag.classList.add('club-name');
                heading_tag.innerText = res.name;
                parent_div.appendChild(heading_tag);

                parent_div.style.cursor = 'pointer';

                document.getElementById('main-content').appendChild(parent_div);

                parent_div.addEventListener('click', function () {
                    buildPopup(res.picture, res.name, res.description, res.category1, res.id);
                });

                document.getElementById('close').onclick = function () {
                    document.getElementById('img-logo').removeChild(document.getElementById('remove-after-use'));
                    closePopup();
                };

            }
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/displayMyClubs", true);
    xhttp.send();
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchAll();
    }
}



function newPage(id) {
    window.open('/clubs/' + encodeURIComponent(id), "_blank");
}

document.getElementsByClassName('close')[0].onclick = function () {
    document.getElementById('img-logo').removeChild(document.getElementById('remove-after-use'));
    document.getElementsByClassName('popup')[0].style.display = 'none';
};

// close the extra div when pressing escape key
window.addEventListener('keydown', function (event) {
    if (event.key == 'Escape') {
        document.getElementsByClassName('popup')[0].style.display = 'none';
        document.getElementById('img-logo').removeChild(document.getElementById('remove-after-use'));
        document.getElementsByClassName('popup')[count].style.display = 'none';
        count++;
        categoryNum = 0;
    }
});


let odd = 0;
function showFilters() {
    if (odd % 2 === 0) {
        document.getElementById('filter-options').style.display = 'block';
        document.getElementById('filter-btn').classList.add('filter-btn-active');
        odd++;
    } else {
        document.getElementById('filter-options').style.display = 'none';
        document.getElementById('filter-btn').classList.remove('filter-btn-active');
        odd++;
    }
}
