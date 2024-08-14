function init_popup() {
    document.body.classList.add("noscroll");
    document.getElementsByTagName('html')[0].classList.add("noscroll");
    var push = document.getElementById("main_popup");
    if (push) {
        push.innerHTML = "";
    } else {
        push = document.createElement("div");
        push.id = "main_popup";
        document.body.prepend(push);
    }
}

function close_popup() {
    document.body.classList.remove("noscroll");
    document.getElementsByTagName('html')[0].classList.remove("noscroll");
    var push = document.getElementById("main_popup");
    if (push) {
        push.remove();
    }
}

let admin = new Vue({
    el: '#admin',
    data: {
        current: '',
        drop: {
            admin: false,
            user: false,
            active: false,
            pending: false,
            closed: false
        },
        users: [],
        clubs: [],
        self: ""
    },
    methods: {
        set_current(val) {
            this.current = val;
        },
        set_drop(type, bool) {
            if (type === "admin") {
                this.drop.admin = bool;
            } else if (type === "user") {
                this.drop.user = bool;
            } else if (type === "active") {
                this.drop.active = bool;
            } else if (type === "pending") {
                this.drop.pending = bool;
            } else if (type === "closed") {
                this.drop.closed = bool;
            }
        },
        manage_user(email) {
            let user = this.users.find((x) => x.email === email);
            // manage user with id

            // make interface
            init_popup();
            var push = document.getElementById("main_popup");

            var popup = document.createElement("div");
            popup.id = "popup_body";
            let block = document.createElement("div");
            block.classList.add("block");
            push.appendChild(block);
            let p = document.createElement("p");
            p.innerText = user.username + " (" + user.email + ")";
            if (user.role === "admin") {
                p.innerText += " (ADMIN)";
            }
            let edit_button = document.createElement("button");
            edit_button.setAttribute("type", "button");
            edit_button.innerText = "Edit";
            edit_button.classList.add("edit_button");
            edit_button.addEventListener("click", function () {
                admin.edit_user(email);
            });
            let cancel_button = document.createElement("button");
            cancel_button.setAttribute("type", "button");
            cancel_button.innerText = "Cancel";
            cancel_button.setAttribute("onclick", `close_popup()`);
            popup.appendChild(p);
            popup.appendChild(edit_button);
            if (user.role === "admin") {
                let unset_admin_button = document.createElement("button");
                unset_admin_button.setAttribute("type", "button");
                unset_admin_button.innerText = "Remove As Admin";
                unset_admin_button.setAttribute("onclick", `unset_admin("${email}")`);
                popup.appendChild(unset_admin_button);
            } else {
                let set_admin_button = document.createElement("button");
                set_admin_button.setAttribute("type", "button");
                set_admin_button.innerText = "Set As Admin";
                set_admin_button.setAttribute("onclick", `set_admin("${email}")`);
                popup.appendChild(set_admin_button);
            }
            popup.appendChild(cancel_button);

            push.appendChild(popup);
            document.body.prepend(push);
        },
        edit_user(email) {
            let user = this.users.find((x) => x.email === email);
            // edit user with id

            // make interface
            init_popup();
            var push = document.getElementById("main_popup");

            var popup = document.createElement("div");
            popup.id = "popup_body";
            let block = document.createElement("div");
            block.classList.add("block");
            push.appendChild(block);
            let p = document.createElement("p");
            p.innerText = "Email: " + user.email;
            if (user.role === "admin") {
                p.innerText += " (ADMIN)";
            }

            let name = document.createElement("textarea");
            name.innerText = user.username;
            name.title = "Username";
            name.name = "user_name";
            name.maxLength = "18";
            name.classList.add("textarea_name");

            let fname = document.createElement("textarea");
            fname.innerText = user.firstname;
            fname.title = "First name";
            fname.name = "user_fname";
            fname.maxLength = "18";
            fname.classList.add("textarea_name");

            let lname = document.createElement("textarea");
            lname.innerText = user.lastname;
            lname.title = "Last name";
            lname.name = "user_lname";
            lname.maxLength = "18";
            lname.classList.add("textarea_name");

            let contact = document.createElement("textarea");
            contact.innerText = user.contact;
            contact.title = "Contact";
            contact.name = "user_contact";
            contact.style.height = '100px';
            contact.maxLength = "500";

            let pfp = document.createElement("img");
            pfp.alt = user.username + " Profile Picture";
            pfp.src = user.profile_picture;
            pfp.title = "Profile Picture";
            pfp.name = "user_pfp";
            pfp.classList.add("edit_picture");

            let picture_button = document.createElement("button");
            picture_button.setAttribute("type", "button");
            picture_button.innerText = "Remove Picture";
            picture_button.name = "picture_button";
            picture_button.setAttribute("onclick", `remove_pfp("${user.profile_picture}")`);

            let pfp_div = document.createElement("div");
            pfp_div.appendChild(pfp);
            pfp_div.appendChild(picture_button);
            pfp_div.classList.add("picture_div");

            let bio = document.createElement("textarea");
            bio.innerText = user.biography;
            bio.title = "Biography";
            bio.name = "user_bio";
            bio.style.height = '152px';
            bio.maxLength = "500";
            let save_button = document.createElement("button");
            save_button.setAttribute("type", "button");
            save_button.innerText = "Save";
            save_button.setAttribute("onclick", `save_user_popup("${email}")`);
            let cancel_button = document.createElement("button");
            cancel_button.setAttribute("type", "button");
            cancel_button.innerText = "Cancel";
            cancel_button.setAttribute("onclick", 'close_popup()');
            cancel_button.addEventListener("click", function () {
                admin.manage_user(email);
            });

            let buttons = document.createElement("div");
            buttons.classList.add("pop_buttons");
            buttons.appendChild(save_button);
            buttons.appendChild(cancel_button);

            popup.appendChild(p);

            let s1 = document.createElement("div");
            s1.classList.add("section_1");

            let fdiv = document.createElement("div");
            let f_name = document.createElement("p");
            f_name.innerText = "First Name";
            f_name.classList.add("input_heading");
            fdiv.appendChild(f_name);
            fdiv.appendChild(fname);

            let ldiv = document.createElement("div");
            let l_name = document.createElement("p");
            l_name.innerText = "Last Name";
            l_name.classList.add("input_heading");
            ldiv.appendChild(l_name);
            ldiv.appendChild(lname);

            let p_name = document.createElement("p");
            p_name.innerText = "Username";
            p_name.classList.add("input_heading");
            let div1 = document.createElement("div");
            div1.appendChild(p_name);
            div1.appendChild(name);

            s1.appendChild(div1);
            s1.appendChild(fdiv);
            s1.appendChild(ldiv);
            popup.appendChild(s1);

            let p_bio = document.createElement("p");
            p_bio.innerText = "Biography";
            p_bio.classList.add("input_heading");
            let div2 = document.createElement("div");
            div2.classList.add("section_2");
            div2.appendChild(pfp_div);
            let bio_div = document.createElement("div");
            bio_div.classList.add("bio_div");
            bio_div.appendChild(p_bio);
            bio_div.appendChild(bio);
            div2.appendChild(bio_div);
            popup.appendChild(div2);
            let p_contact = document.createElement("p");
            p_contact.innerText = "Contact";
            p_contact.classList.add("input_heading");
            let div3 = document.createElement("div");
            div3.appendChild(p_contact);
            div3.appendChild(contact);
            popup.appendChild(div3);
            popup.appendChild(buttons);
            push.appendChild(popup);
            document.body.prepend(push);
        },
        manage_club(id) {
            let club = this.clubs.find((x) => x.id === id);
            // manage club with id

            // make interface
            init_popup();
            var push = document.getElementById("main_popup");

            var popup = document.createElement("div");
            popup.id = "popup_body";
            let block = document.createElement("div");
            block.classList.add("block");
            push.appendChild(block);
            let p = document.createElement("p");
            p.innerText = club.name + " (" + club.id + ")";
            let edit_button = document.createElement("button");
            edit_button.setAttribute("type", "button");
            edit_button.innerText = "Edit";
            edit_button.addEventListener("click", function () {
                admin.edit_club(id);
            });
            let cancel_button = document.createElement("button");
            cancel_button.setAttribute("type", "button");
            cancel_button.innerText = "Cancel";
            cancel_button.setAttribute("onclick", `close_popup()`);
            let delete_button;
            let approve_button;
            let club_buttons = document.createElement("div");
            club_buttons.classList.add("club_buttons");
            if (club.status === "closed" || club.status === "pending") {
                approve_button = document.createElement("button");
                approve_button.setAttribute("type", "button");
                approve_button.innerText = "Approve";
                approve_button.setAttribute("onclick", `approve_club(${id})`);
                approve_button.classList.add("approve_button");
                club_buttons.appendChild(approve_button);
            }
            if (club.status === "active" || club.status === "pending") {
                delete_button = document.createElement("button");
                delete_button.setAttribute("type", "button");
                delete_button.innerText = "Delete";
                delete_button.setAttribute("onclick", `close_club(${id})`);
                delete_button.classList.add("delete_button");
                club_buttons.appendChild(delete_button);
            }

            popup.appendChild(p);
            popup.appendChild(edit_button);
            popup.appendChild(club_buttons);
            popup.appendChild(cancel_button);
            push.appendChild(popup);
            document.body.prepend(push);
        },
        edit_club(id) {
            let club = this.clubs.find((x) => x.id === id);
            // edit club with id

            // make interface
            init_popup();
            var push = document.getElementById("main_popup");

            var popup = document.createElement("div");
            popup.id = "popup_body";
            let block = document.createElement("div");
            block.classList.add("block");
            push.appendChild(block);

            let p = document.createElement("p");
            p.innerText = "ID: " + club.id;

            let name = document.createElement("textarea");
            name.innerText = club.name;
            name.title = "Club Name";
            name.name = "club_name";
            name.classList.add("textarea_name");
            let description = document.createElement("textarea");
            description.innerText = club.description;
            description.title = "Description";
            description.name = "club_desc";
            description.style.height = '200px';
            description.maxLength = "2000";

            let logo = document.createElement("img");
            logo.alt = club.name + " Club Logo";
            logo.src = club.picture;
            logo.title = "Club Logo";
            logo.name = "club_logo";
            logo.classList.add("edit_picture");

            let picture_button = document.createElement("button");
            picture_button.setAttribute("type", "button");
            picture_button.innerText = "Remove Picture";
            picture_button.name = "picture_button";
            picture_button.setAttribute("onclick", `remove_logo("${club.picture}")`);

            let logo_div = document.createElement("div");
            logo_div.appendChild(logo);
            logo_div.appendChild(picture_button);
            logo_div.classList.add("picture_div");

            let category = document.createElement('SELECT');

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

            if (club.category1 === "Skills Development") {
                option1.setAttribute('selected', '');
            } else if (club.category1 === "Religion") {
                option2.setAttribute('selected', '');

            } else if (club.category1 === "Culture and Languages") {
                option3.setAttribute('selected', '');

            } else if (club.category1 === "Faculty") {
                option4.setAttribute('selected', '');

            } else if (club.category1 === "Hobbies") {
                option5.setAttribute('selected', '');

            }

            category.title = "Category";
            category.name = "club_category";

            category.appendChild(option1);
            category.appendChild(option2);
            category.appendChild(option3);
            category.appendChild(option4);
            category.appendChild(option5);

            category.setAttribute('required', '');

            let mdiv = document.createElement("div");
            let mandiv = document.createElement("div");
            mandiv.classList.add("managers");
            // add button to make self manager
            if (!club.managers.includes(this.self)) {
                var self_manager = document.createElement("button");
                self_manager.setAttribute("type", "button");
                self_manager.innerText = "Add Self As Manager";
                self_manager.setAttribute("onclick", `make_manager(${id})`);
                mdiv.appendChild(self_manager);
            }
            mdiv.appendChild(mandiv);

            let save_button = document.createElement("button");
            save_button.setAttribute("type", "button");
            save_button.innerText = "Save";
            save_button.setAttribute("onclick", `save_club_popup(${id})`);
            let cancel_button = document.createElement("button");
            cancel_button.setAttribute("type", "button");
            cancel_button.innerText = "Cancel";
            cancel_button.setAttribute("onclick", 'close_popup()');
            cancel_button.addEventListener("click", function () {
                admin.manage_club(id);
            });

            let buttons = document.createElement("div");
            buttons.classList.add("pop_buttons");
            buttons.appendChild(save_button);
            buttons.appendChild(cancel_button);

            popup.appendChild(p);


            let d = document.createElement("div");
            d.classList.add("section_3");
            d.appendChild(logo_div);


            let p_name = document.createElement("p");
            p_name.innerText = "Club Name";
            p_name.classList.add("input_heading");
            let div1 = document.createElement("div");
            div1.appendChild(p_name);
            div1.appendChild(name);
            popup.appendChild(div1);

            let p_cat = document.createElement("p");
            p_cat.innerText = "Category";
            p_cat.classList.add("input_heading");
            let div3 = document.createElement("div");
            div3.appendChild(p_cat);
            div3.appendChild(category);
            popup.appendChild(div3);


            let d2 = document.createElement("div");
            d2.classList.add("d2");
            d2.appendChild(div1);
            d2.appendChild(div3);
            d2.appendChild(mdiv);

            d.appendChild(d2);
            popup.appendChild(d);

            let p_desc = document.createElement("p");
            p_desc.innerText = "Description";
            p_desc.classList.add("input_heading");
            let div2 = document.createElement("div");
            div2.appendChild(p_desc);
            div2.appendChild(description);
            popup.appendChild(div2);

            // popup.appendChild(managers);
            popup.appendChild(buttons);
            push.appendChild(popup);
            document.body.prepend(push);
            this.create_managers(id);
        },
        create_managers(id) {
            let club = this.clubs.find((x) => x.id === id);
            let mandiv = document.getElementsByClassName("managers")[0];
            mandiv.innerHTML = "";
            for (let i = 0; i < club.managers.length; i++) {
                let div = document.createElement("div");
                let mb = document.createElement("input");
                mb.type = "checkbox";
                mb.id = club.managers[i];
                mb.classList.add("managerBox");
                mb.name = club.managers[i];
                mb.value = club.managers[i];
                let custom = document.createElement("label");
                custom.setAttribute("for", club.managers[i]);
                custom.classList.add("customLabel");
                let m = document.createElement("label");
                m.setAttribute("for", club.managers[i]);
                m.innerText = club.managers[i];
                m.classList.add("unselectable");
                div.appendChild(mb);
                div.appendChild(custom);
                div.appendChild(m);
                mandiv.appendChild(div);
            }
        },
        open(path) {
            window.open(path);
        }
    }
});

function update_data(f, p) {
    var get_users = new XMLHttpRequest();

    get_users.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            Vue.set(admin, 'users', JSON.parse(this.responseText));
        }
    };

    get_users.open("GET", "/admin/users.json", true);

    get_users.send();

    var get_clubs = new XMLHttpRequest();

    get_clubs.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            Vue.set(admin, 'clubs', JSON.parse(this.responseText));
            if (typeof f === 'function') {
                f(p);
            }
        }
    };

    get_clubs.open("GET", "/admin/clubs.json", true);

    get_clubs.send();

    var get_self = new XMLHttpRequest();

    get_self.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            Vue.set(admin, 'self', JSON.parse(this.responseText)[0].user_email);
        }
    };

    get_self.open("GET", "/admin/self.email", true);

    get_self.send();
}

function set_admin(_email) {
    if (window.confirm("Are you sure you want to set this user as a system administrator?")) {
        var s = new XMLHttpRequest();

        s.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                update_data();
                close_popup();
            }
        };

        s.open("POST", "/admin/setadmin", true);
        s.setRequestHeader('Content-Type', 'application/json');
        s.send(JSON.stringify({ email: _email }));
    }
}

function unset_admin(_email) {
    if (window.confirm("Are you sure you want to unset this user as a system administrator?")) {
        var s = new XMLHttpRequest();

        s.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                update_data();
                close_popup();
            } else if (this.readyState === 4 && this.status === 400) {
                window.alert("Cannot unset yourself as a system administrator.");
            }
        };

        s.open("POST", "/admin/unsetadmin", true);
        s.setRequestHeader('Content-Type', 'application/json');
        s.send(JSON.stringify({ email: _email }));
    }
}

function new_admin() {
    // make interface
    init_popup();
    var push = document.getElementById("main_popup");

    var popup = document.createElement("div");
    popup.id = "popup_body";
    let block = document.createElement("div");
    block.classList.add("block");
    push.appendChild(block);

    let p = document.createElement("p");
    p.innerText = "Admin Sign Up";


    popup.insertAdjacentHTML("beforeend", `
    <form id="admin_signup" onsubmit="signup_admin(event)">
    <div class="content_input signup_div">
        <p>Username</p>
        <input type="text" name="username" class="plb plb_signup" placeholder="Username" maxlength="18" required>
    </div>
    <div class="content_input signup_div">
        <p>Email</p>
        <input type="email" name="email" class="plb plb_signup" placeholder="Email" maxlength="320" required>
    </div>
    <div class="content_input signup_div">
        <p>Password</p>
        <input type="password" name="password" class="plb plb_signup" placeholder="Password" minlength="8" required>
    </div>
    <div class="sign_buttons">
        <button type="submit" class="btn">Sign up</button>
        <button type="button" onclick="close_popup()">Cancel</button>
    </div>
    </form>`);

    push.appendChild(popup);
    document.body.prepend(push);
}

function signup_admin(event) {
    event.preventDefault();
    var a = new XMLHttpRequest();

    a.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            update_data();
            close_popup();
        } else if (this.readyState === 4 && this.status === 409) {
            window.alert("Email is already taken, please try another one!");
        } else if (this.readyState === 4) {
            window.alert("Signup Error.");
        }
    };

    a.open("POST", "/admin/signup", true);
    a.setRequestHeader('Content-Type', 'application/json');

    let requestBody = {};
    let data = new FormData(document.getElementById('admin_signup'));

    for (const [key, value] of data.entries()) {
        requestBody[key] = value;
    }

    a.send(JSON.stringify(requestBody));
}

function approve_club(id) {
    if (window.confirm("Are you sure you want to approve this club?")) {
        var s = new XMLHttpRequest();

        s.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                update_data();
                close_popup();
            }
        };

        s.open("POST", "/admin/approve", true);
        s.setRequestHeader('Content-Type', 'application/json');
        s.send(JSON.stringify({ club_id: id }));
    }
}

function close_club(id) {
    if (window.confirm("Are you sure you want to close this club?")) {
        var s = new XMLHttpRequest();

        s.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                update_data();
                close_popup();
            }
        };

        s.open("POST", "/admin/close", true);
        s.setRequestHeader('Content-Type', 'application/json');
        s.send(JSON.stringify({ club_id: id }));
    }
}

function remove_pfp(img) {
    let pfp = document.getElementsByName("user_pfp")[0];
    pfp.src = "/images/users/profile/default.png";

    let button = document.getElementsByName("picture_button")[0];
    button.innerText = "Revert Picture";
    button.setAttribute("onclick", `reset_pfp("${img}")`);
}

function reset_pfp(img) {
    let pfp = document.getElementsByName("user_pfp")[0];
    pfp.src = img;

    let button = document.getElementsByName("picture_button")[0];
    button.innerText = "Remove Picture";
    button.setAttribute("onclick", `remove_pfp("${img}")`);
}

function remove_logo(img) {
    let logo = document.getElementsByName("club_logo")[0];
    logo.src = "/images/club/default.png";

    let button = document.getElementsByName("picture_button")[0];
    button.innerText = "Revert Picture";
    button.setAttribute("onclick", `reset_logo("${img}")`);
}

function reset_logo(img) {
    let logo = document.getElementsByName("club_logo")[0];
    logo.src = img;

    let button = document.getElementsByName("picture_button")[0];
    button.innerText = "Remove Picture";
    button.setAttribute("onclick", `remove_logo("${img}")`);
}

function save_user_popup(email) {
    if (window.confirm("Are you sure you want to save new user info?")) {
        let new_name = document.getElementsByName("user_name")[0].value;
        let new_fname = document.getElementsByName("user_fname")[0].value;
        let new_lname = document.getElementsByName("user_lname")[0].value;

        let new_contact = document.getElementsByName("user_contact")[0].value;
        let new_bio = document.getElementsByName("user_bio")[0].value;
        let pfp_url = document.getElementsByName("user_pfp")[0].src;
        let u = new URL(pfp_url);
        let new_pfp = u.pathname;

        var s = new XMLHttpRequest();

        s.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                update_data();
                close_popup();
                admin.manage_user(email);
            } else if (this.readyState === 4) {
                window.alert("Unable to perform action.");
            }
        };

        s.open("POST", "/admin/edit/user", true);
        s.setRequestHeader('Content-Type', 'application/json');
        s.send(JSON.stringify({
            email: email,
            username: new_name,
            firstname: new_fname,
            lastname: new_lname,
            contact: new_contact,
            biography: new_bio,
            profile_picture: new_pfp
        }));
    }
}

function save_club_popup(id) {
    if (window.confirm("Are you sure you want to save new club info?")) {
        let new_name = document.getElementsByName("club_name")[0].value;
        let new_desc = document.getElementsByName("club_desc")[0].value;
        let new_cat = document.getElementsByName("club_category")[0].value;
        let logo_url = document.getElementsByName("club_logo")[0].src;
        let u = new URL(logo_url);
        let new_logo = u.pathname;
        let rmm = document.querySelectorAll('.managerBox:checked');
        var rm_managers = [];
        for (let i = 0; i < rmm.length; i++) {
            rm_managers.push(rmm[i].value);
        }

        var s = new XMLHttpRequest();

        s.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                update_data();
                close_popup();
                admin.manage_club(id);
            } else if (this.readyState === 4) {
                window.alert("Unable to perform action.");
            }
        };

        s.open("POST", "/admin/edit/club", true);
        s.setRequestHeader('Content-Type', 'application/json');
        s.send(JSON.stringify({
            id: id,
            name: new_name,
            description: new_desc,
            category1: new_cat,
            picture: new_logo,
            rm_managers: rm_managers
        }));
    }
}

function cm(i) {
    admin.create_managers(i);
}

async function make_manager(id) {
    var mm = new XMLHttpRequest();

    mm.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                update_data(cm, id);
            } else if (this.readyState === 4) {
                window.alert("Unable to perform action.");
            }
        };

        mm.open("POST", "/admin/edit/club/makemanager", true);
        mm.setRequestHeader('Content-Type', 'application/json');
        mm.send(JSON.stringify({
            id: id
        }));
}