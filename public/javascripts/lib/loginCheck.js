function check() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (this.responseText === "guest") {
                window.location.pathname = '/login';
            }
        } else if (this.readyState === 4) {
            // Error redirect anyway
            window.location.pathname = '/login';
        }
    };

    xhttp.open("GET", "/role.type", true);

    xhttp.send();
}
