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

function tabindexSignUp() {
    var elements = document.querySelectorAll("#signUpMain *:not(br):not([id='sign_infor']):not(h1):not(div)");
    for (let i = 0; i < elements.length; i++) {
        elements[i].tabIndex = 0;
    }


    addEnterKey();
}

function showPageC(element) {
    // console.log(element.innerText);
    const signUpNode = document.getElementById('signUpMain');
    const logInNode = document.getElementById('logInMain');
    // const changeNode = document.getElementById('changePasswordMain');

    if (element.innerText === "Don't Have An Account? Sign Up Now") {
        signUpNode.style.display = 'block';
        logInNode.style.display = 'none';
        // changeNode.style.display = 'none';
    } else if (element.innerText === "Have your password? Log In Here" || element.innerText === "Already Have An Account? Log In Here") {
        // changeNode.style.display = 'none';
        signUpNode.style.display = 'none';
        logInNode.style.display = 'block';
    } else {
        // changeNode.style.display = 'block';
        signUpNode.style.display = 'none';
        logInNode.style.display = 'none';
    }
    tabindexSignUp();
}

function TogglePasswordVi() {
    const togglePasswordLogin = document.querySelector('#loginTogglePassword');
    const passwordLogin = document.querySelector('#loginPassword');

    const togglePasswordSignUp = document.querySelector('#signTogglePassword');
    const passwordSignUp = document.querySelector('#signPassword');

    togglePasswordLogin.addEventListener('click', function (e) {
        // toggle the type attribute
        const type = passwordLogin.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordLogin.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
    });

    togglePasswordSignUp.addEventListener('click', function (e) {
        // toggle the type attribute
        const type = passwordSignUp.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordSignUp.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
    });
}



function tabindexlogin() {
    var elements = document.querySelectorAll("#logInMain *:not(br):not([id='log_infor']):not(h1)");
    for (let i = 0; i < elements.length; i++) {
        elements[i].tabIndex = 0;
    }

    // const google = document.querySelector(".google");
    // google.tabIndex = 0;
    // const github = document.querySelector(".github");
    // github.tabIndex = 0;
}

const vueinst = new Vue({
    el: '#mainBody',
    data() {
        return {
            curremail: '',
            logIndiv: {
                username: '',
                password: ''
            },
            signUpdiv: {
                username: '',
                email: '',
                password: ''
            },
            changediv: {
                username: '',
                email: '',
                password: ''
            }
        };
    },
    methods: {
        login() {
            let logindata = {
                email: this.logIndiv.username,
                password: this.logIndiv.password
            };
            let req = new XMLHttpRequest();
            req.open('POST', '/login');
            req.setRequestHeader('Content-Type', 'application/json');
            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    window.location.href = '/';
                } else if (req.readyState === 4 && req.status === 403) {
                    alert("Login FAILED, please try again!");
                } else if (req.readyState === 4) {
                    alert("Error occured, please try again later!");
                }
            };
            req.send(JSON.stringify(logindata));
        },
        signup() {
            let signupdata = {
                username: this.signUpdiv.username,
                email: this.signUpdiv.email,
                password: this.signUpdiv.password
            };
            let req = new XMLHttpRequest();
            req.open('POST', '/signup');
            req.setRequestHeader('Content-Type', 'application/json');
            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    window.location.href = '/';
                } else if (req.readyState === 4 && req.status === 401) {
                    alert("Email is already taken, please try another one!");
                } else if (req.readyState === 4) {
                    alert("Error occured, please try again later!");
                }
            };
            req.send(JSON.stringify(signupdata));
        },
        loginBtn() {
            document.querySelector('#btn_login').click();
        },
        signupBtn() {
            document.querySelector('#btn_signup').click();
        }
    }
});



function do_google_login(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    let req = new XMLHttpRequest();
    req.open('POST', '/login');
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            window.location.href = '/';
        } else if (req.readyState === 4 && req.status === 401) {
            alert("Fail to log in, please try again later!");
        } else if (req.readyState === 4) {
            alert("Error occured, please try again later!");
        }
    };
    req.send(JSON.stringify(response));
}
