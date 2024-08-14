const vue_events = new Vue({
    el: '#event-layout',
    data: {
        upcoming: true,
        previous: false,
        upcomingEvents: [],
        pastEvents: []
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
        },

        RSVPDisplay: function(){
            let RSVPButtons = document.getElementsByClassName('RSVP-OR-LEAVE');

            for(let i = 0; i < RSVPButtons.length; i+=2){
                let { id } = RSVPButtons[i];
                let xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function(){
                    if(xhttp.readyState === 4 && xhttp.status === 200){
                        if(this.responseText[1] == true){
                            document.getElementById(id).style.display = 'none';
                            document.getElementById(id+'pt2').style.display = 'block';
                        } else {
                            document.getElementById(id).style.display = 'block';
                            document.getElementById(id+'pt2').style.display = 'none';
                        }
                    } else if(xhttp.readyState === 4 && xhttp.status === 400){
                        document.getElementById(id).style.display = 'block';
                        document.getElementById(id+'pt2').style.display = 'none';
                        window.location.assign('/login');
                    }
                };

                xhttp.open("GET", "/ShowRSVPOrLeave?id=" + encodeURIComponent(id), true);
                xhttp.send();
            }

        }
    },
    updated(){
        this.RSVPDisplay();
    }
});



function displayEvents(){
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(xhttp.readyState === 4 && xhttp.status === 200){
            let future = JSON.parse(this.responseText);
            future = JSON.parse(future.upcoming);

            Vue.set(vue_events, 'upcomingEvents', future);

            let notFuture = JSON.parse(this.responseText);
            notFuture = JSON.parse(notFuture.past);

            Vue.set(vue_events, 'pastEvents', notFuture);

            // RSVPDisplay();
        }
    };

    xhttp.open("GET", "/displayEvents");
    xhttp.send();
}
