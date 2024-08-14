let featured = new Vue({
    el: '#main_slide',
    data: {
        featured_club: [{
            name: "loading...",
            description: "loading...",
            category1: "loading..."
        }],
        featured_event: [{
            name: "loading...",
            title: "loading...",
            content: "loading...",
            location: "loading...",
            event_time: "loading..."
        }]
    },
    methods: {
        get_f_club() {
            if (this.featured_club[0] !== undefined) {
                window.open("/clubs/" + this.featured_club[0].id);
            }
        },
        get_f_event() {
            if (this.featured_event[0] !== undefined) {
                window.open("/clubs/" + this.featured_event[0].club_id + "/events/" + this.featured_event[0].event_id);
            }
        }
    }
});

const vue_posts = new Vue({
    el: '#posts',
    data: {
        offset: 0,
        posts: []
    },
    methods: {
        push_posts(_posts) {
            this.posts.push(_posts);
        }
    }
});

function update_featured() {
    var get_club = new XMLHttpRequest();

    get_club.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            Vue.set(featured, 'featured_club', JSON.parse(this.responseText));
        } else if (this.readyState === 4 && this.status === 404) {
            Vue.set(featured, 'featured_club', [{ name: "No Featured Club", description: "No Featured Club", category1: "No Featured Club" }]);
        } else if (this.readyState === 4) {
            Vue.set(featured, 'featured_club', [{ name: "Error. Reload.", description: "Error. Reload.", category1: "Error. Reload." }]);
        }
    };

    get_club.open("GET", "/featured/club.json", true);

    get_club.send();

    var get_event = new XMLHttpRequest();

    get_event.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            Vue.set(featured, 'featured_event', JSON.parse(this.responseText));
        } else if (this.readyState === 4 && this.status === 404) {
            Vue.set(featured, 'featured_event', [{ name: "No Featured Event", title: "No Featured Event", content: "No Featured Event", location: "No Featured Event", event_time: "No Featured Event"}] );
        } else if (this.readyState === 4) {
            Vue.set(featured, 'featured_event', [[{ name: "Error. Reload.", title: "Error. Reload.", content: "Error. Reload.", location: "No Featured Event", event_time: "Error. Reload."}]] );
        }
    };

    get_event.open("GET", "/featured/event.json", true);

    get_event.send();
}
let slide_index = 1;

// shows slide
function show_slide(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
        slide_index = 1;
    }
    if (n < 1) {
        slide_index = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slide_index - 1].style.display = "block";
    dots[slide_index - 1].className += " active";
}

// moves slide by n
function change_slide(n) {
    show_slide(slide_index += n);
}

// goes to slide n
function current_slide(n) {
    show_slide(slide_index = n);
}

function get_s_new() {
    window.open("/login", "_blank");
}

function update_posts() {
    var getposts = new XMLHttpRequest();

    getposts.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let posts = JSON.parse(this.responseText);
            for (let i = 0; i < posts.length; i++) {
                vue_posts.push_posts(posts[i]);
            }
            Vue.set(vue_posts, 'offset', vue_posts.offset + 5);
        }
    };

    getposts.open("GET", "/posts.json?offset=" + vue_posts.offset, true);

    getposts.send();
}
