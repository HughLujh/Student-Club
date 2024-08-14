const vue_events = new Vue({
    el: '#event-layout',
    data: {
        upcoming: false,
        previous: false,
        rsvp: true,
        upcomingEvents: [],
        pastEvents: [],
        RSVPEvents: []
    },
    methods: {
        moreInfoForEvents: function (id, clubId) {
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if(xhttp.readyState === 4 && xhttp.status === 200){
                    window.location.assign("/clubs/" + encodeURIComponent(clubId) + '/events/' + encodeURIComponent(id));
                }
            };

            xhttp.open("GET", "/clubs/" + encodeURIComponent(clubId) + '/events/' + encodeURIComponent(id), true);
            xhttp.send();
        },

        RSVP: function (id){
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if(xhttp.readyState === 4 && xhttp.status === 200){
                    window.location.reload();
                } else if(xhttp.readyState === 4 && xhttp.status === 400){
                    window.location.assign('/login');
                }
            };

            xhttp.open("GET", "/RSVPEvent?id=" + encodeURIComponent(id), true);
            xhttp.send();
        },

        Leave: function(id){
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if(xhttp.readyState === 4 && xhttp.status === 200){
                    window.location.reload();
                } else if(xhttp.readyState === 4 && xhttp.status === 400){
                    window.location.assign('/login');
                }
            };

            xhttp.open("GET", "/LeaveEvent?id=" + encodeURIComponent(id), true);
            xhttp.send();
        }
    }
});


function displayEvents(){
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(xhttp.readyState === 4 && xhttp.status === 200){
            let notFuture = JSON.parse(this.responseText);

            Vue.set(vue_events, 'pastEvents', notFuture);
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/displayMyPreviousEvents");
    xhttp.send();
}

function displayUpcomingEvents(){
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(xhttp.readyState === 4 && xhttp.status === 200){
            let future = JSON.parse(this.responseText);

            Vue.set(vue_events, 'upcomingEvents', future);
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/displayMyUpcomingEvents");
    xhttp.send();
}

function RSVPedEvents(){
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(xhttp.readyState === 4 && xhttp.status === 200){
            let RSVP = JSON.parse(this.responseText);

            Vue.set(vue_events, 'RSVPEvents', RSVP);
            // RSVPDisplay();
        } else if (xhttp.readyState === 4 && xhttp.status === 400) {
            window.location.assign('/login');
        }
    };

    xhttp.open("GET", "/displayMyRSVPEvents");
    xhttp.send();
}