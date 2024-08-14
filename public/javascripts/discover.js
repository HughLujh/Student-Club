
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
        }
    };

    xhttp.open("GET", "/displayClubs", true);
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
        }
    };

    xhttp.open("GET", "/displayClubs", true);
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

let count = 1;
let categoryNum = 0;
function newClub() {
    // creating the outermost div and appending it to the body tag
    let outermostDiv = document.createElement('DIV');
    outermostDiv.classList.add("popup");
    outermostDiv.style.display = 'flex';
    document.body.appendChild(outermostDiv);

    // creating the inner div to add the form elements and appending it to the outermost div tag
    let innerDiv = document.createElement('DIV');
    innerDiv.classList.add("popup-content");
    outermostDiv.appendChild(innerDiv);


    // creating the closing button for the div
    let closeButton = document.createElement('SPAN');
    closeButton.classList.add("close");
    closeButton.innerHTML = "&times;";
    closeButton.onclick = function () {
        document.getElementsByClassName("popup")[count].style.display = "none";
        count++;
        categoryNum = 0;
        window.location.assign('/discover');
    };
    innerDiv.appendChild(closeButton);

    // creating the form element and appending it to the inner div
    let form = document.createElement('FORM');
    form.setAttribute('action', '/insertClub');
    form.setAttribute('method', 'post');
    form.setAttribute('enctype', 'multipart/form-data');
    innerDiv.appendChild(form);

    // adding an image input in html
    let imgInput = document.createElement('INPUT');
    imgInput.setAttribute('type', 'file');
    imgInput.setAttribute('name', 'image');
    imgInput.setAttribute('accept', 'image/*');
    imgInput.setAttribute('required', '');
    imgInput.classList.add('image-input');
    imgInput.id = 'image';

    let labelForImage = document.createElement('LABEL');
    labelForImage.innerText = 'Select Club Logo Image';
    labelForImage.setAttribute('for', 'image');

    form.appendChild(imgInput);
    form.appendChild(labelForImage);

    imgInput.addEventListener('change', function (e) {
        var filename = '';
        filename = e.target.value.split('\\').pop();
        if (filename) {
            labelForImage.innerText = filename;
        } else {
            labelForImage.innerText = 'Select Club Logo Image';
        }
    });

    // creating a required club name input field and appending it to the form in html
    let inputClubName = document.createElement('INPUT');
    inputClubName.setAttribute('type', 'text');
    inputClubName.setAttribute('placeholder', 'Enter Club Name');
    inputClubName.setAttribute('name', 'clubname');
    inputClubName.setAttribute('maxlength', '100');
    inputClubName.classList.add('input-forms');
    inputClubName.setAttribute('required', '');
    form.appendChild(inputClubName);

    let description = document.createElement('INPUT');
    description.setAttribute('type', 'text');
    description.setAttribute('placeholder', `Enter Description for the club`);
    description.setAttribute('name', 'description');
    description.setAttribute('maxlength', '2000');
    description.classList.add('input-forms');
    description.setAttribute('required', '');
    form.appendChild(description);

    let category = document.createElement('SELECT');

    let option0 = document.createElement('OPTION');
    option0.setAttribute('disabled', '');
    option0.setAttribute('selected', '');
    option0.setAttribute('hidden', '');
    option0.innerText = 'Choose a Category';

    let option1 = document.createElement('OPTION');
    option1.setAttribute('value', 'Skills Development');
    option1.innerText = 'Skills Development';

    let option2 = document.createElement('OPTION');
    option2.setAttribute('value', 'Religion');
    option2.innerText = 'Religion';

    let option3 = document.createElement('OPTION');
    option3.setAttribute('value', 'Culture and Languages');
    option3.innerText = 'Culture and Languages';

    let option4 = document.createElement('OPTION');
    option4.setAttribute('value', 'Faculty');
    option4.innerText = 'Faculty';

    let option5 = document.createElement('OPTION');
    option5.setAttribute('value', 'Hobbies');
    option5.innerText = 'Hobbies';

    category.setAttribute('name', 'category');
    category.classList.add('input-forms');

    category.appendChild(option0);
    category.appendChild(option1);
    category.appendChild(option2);
    category.appendChild(option3);
    category.appendChild(option4);
    category.appendChild(option5);

    category.setAttribute('required', '');
    form.appendChild(category);

    // creating a submit button and appending it to the form
    let submitButton = document.createElement('INPUT');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('value', 'Submit');
    submitButton.classList.add('submit-btn');

    // letting the user to add categories in the website and appending it to the form
    // let addCategory = document.createElement('BUTTON');
    // let text = document.createTextNode('Add category');
    // addCategory.setAttribute('type', 'button');
    // addCategory.appendChild(text);
    // addCategory.classList.add('add-category');
    // addCategory.onclick = function(){
    //     categoryNum++;
    //     if(categoryNum < 2){
    //         let addedCategory = document.createElement('INPUT');
    //         addedCategory.setAttribute('type', 'text');
    //         addedCategory.setAttribute('placeholder', `Enter Category ${categoryNum+1} for Club`);
    //         addedCategory.setAttribute('name', 'category-name');
    //         addedCategory.classList.add('input-forms');
    //         addedCategory.setAttribute('required', '');
    //         form.appendChild(addedCategory);
    //         form.appendChild(addCategory);
    //         form.appendChild(submitButton);
    //     } else {
    //         alert('Cannot Add more than 2 categories!');
    //     }
    // };
    // form.appendChild(addCategory);
    form.appendChild(submitButton);
}

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