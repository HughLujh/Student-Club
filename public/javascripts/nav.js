function searchItem(icon) {
  var searchbar_desktop = document.getElementById("search-desktop-dropdown");
  var searchbar_mobile = document.getElementById("search-mobile-dropdown");
  searchbar_desktop.innerHTML = "";
  searchbar_mobile.innerHTML = "";
  let searchValue = icon.parentNode.querySelector("input").value;
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      let res = JSON.parse(xhttp.response);
      if (res.length) {
        // desktop
        let div = document.createElement("div");
        div.classList.add("dropdown");
        let dropdown = document.createElement("div");
        dropdown.classList.add("dropdown-content");
        // mobile
        let ul = document.createElement("ul");
        ul.classList.add("dropdown");
        for (let i = 0; i < res.length; i++) {
          if (res[i].type === "club") {
            dropdown.insertAdjacentHTML("beforeend", `<a href="/clubs/${res[i].id}">CLUB-${res[i].name}</a>`);
            ul.insertAdjacentHTML("beforeend", `<li><a href="/clubs/${res[i].id}">CLUB-${res[i].name}</a></li>`);
          } else if (res[i].type === "post") {
            dropdown.insertAdjacentHTML("beforeend", `<a href="/clubs/${res[i].club_id}/posts/${res[i].id}">POST-${res[i].title}</a>`);
            ul.insertAdjacentHTML("beforeend", `<li><a href="/clubs/${res[i].club_id}/posts/${res[i].id}">POST-${res[i].title}</a></li>`);
          } else if (res[i].type === "event") {
            dropdown.insertAdjacentHTML("beforeend", `<a href="/clubs/${res[i].club_id}/events/${res[i].id}">EVENT-${res[i].title}</a>`);
            ul.insertAdjacentHTML("beforeend", `<li><a href="/clubs/${res[i].club_id}/events/${res[i].id}">EVENT-${res[i].title}</a></li>`);
          }
        }
        dropdown.setAttribute("style", "display: block");
        ul.setAttribute("style", "display: block");
        div.appendChild(dropdown);
        searchbar_desktop.appendChild(div);
        searchbar_mobile.appendChild(ul);
      }
    }
  };

  xhttp.open('GET', `/get_posts?q=${searchValue}`, true);

  xhttp.send();
}
async function get_nav() {
  function create(role) {
    let head = document.getElementById("head_nav");
    if (role === "guest") {
      head.insertAdjacentHTML("afterend", `
        <header id="mobile_head_nav">
        <p>LANGEN</p>
        <nav class="navbar mobile_nav">
        <ul class="nav_links">
        <li class="searchStyle smobile">
        <input type="text" placeholder="Search" class="nav_search">
        <i class="fa fa-search"></i>
        <div id="search-mobile-dropdown">
        </div>
        </li>
        <li><a href="/">Home</a></li>
        <li><a href="/discover">All Clubs</a></li>
        <li><a href="/events">All Events</a></li>
        <li><a href="/login">Login/Signup</a></li>
        </ul></nav>
        <button type="button" class="toggle-btn"><span class="icon">☰</span></button>
        </header>
        <header id="desktop_head_nav">
        <p>LANGEN</p>
        <nav class="navbar desktop_nav">
        <ul class="nav_links">
        <li><a href="/">Home</a></li>
        <li><a href="/discover">All Clubs</a></li>
        <li><a href="/events">All Events</a></li>
        <li><a href="/login">Login/Signup</a></li>
        </ul></nav>
        <div class="searchStyle">
        <input type="text" placeholder="Search" class="nav_search">
        <i class="fa fa-search"></i>
        <div id="search-desktop-dropdown">
        </div>
        </div>
        </header>`);
    } else if (role === "user") {
      head.insertAdjacentHTML("afterend", `
        <header id="mobile_head_nav">
        <p>LANGEN</p>
        <nav class="navbar mobile_nav">
        <ul class="nav_links">
        <li class="searchStyle smobile">
        <input type="text" placeholder="Search" class="nav_search">
        <i class="fa fa-search"></i>
        <div id="search-mobile-dropdown">
        </div>
        </li>
        <li><a href="/">Home</a></li>
        <li><a>Clubs</a>
        <ul class="dropdown">
        <li><a href="/discover">All Clubs</a></li>
        <li><a href="/myclubs">Your Clubs</a></li>
        </ul></li>
        <li><a>Events</a>
        <ul class="dropdown">
        <li><a href="/events">All Events</a></li>
        <li><a href="/myevents">Your Events</a></li>
        </ul></li>
        <li><a>Account</a>
        <ul class="dropdown">
        <li><a href="/profile">Profile</a></li>
        <li><a href="/notification">Settings</a></li>
        <li><a href="/logout">Log Out</a></li>
        </ul></li></ul></nav>
        <button type="button" class="toggle-btn"><span class="icon">☰</span></button>
        </header>
        <header id="desktop_head_nav">
        <p>LANGEN</p>
        <nav class="navbar desktop_nav">
        <ul class="nav_links">
        <li><a href="/">Home</a></li>
        <li><div class="dropdown"><a>Clubs</a>
        <div class="dropdown-content">
        <a href="/discover">All Clubs</a>
        <a href="/myclubs">Your Clubs</a>
        </div></div></li>
        <li><div class="dropdown"><a>Events</a>
        <div class="dropdown-content">
        <a href="/events">All Events</a>
        <a href="/myevents">Your Events</a>
        </div></div></li>
        <li><div class="dropdown"><a>Account</a>
        <div class="dropdown-content">
        <a href="/profile">Profile</a>
        <a href="/notification">Settings</a>
        <a href="/logout">Log Out</a>
        </div></div></li></ul></nav>
        <div class="searchStyle">
        <input type="text" placeholder="Search" class="nav_search">
        <i class="fa fa-search"></i>
        <div id="search-desktop-dropdown">
        </div>
        </div>
        </header>`);
    } else if (role === "admin") {
      head.insertAdjacentHTML("afterend", `
        <header id="mobile_head_nav">
        <p>LANGEN</p>
        <nav class="navbar mobile_nav">
        <ul class="nav_links">
        <li class="searchStyle smobile">
        <input type="text" placeholder="Search" class="nav_search">
        <i class="fa fa-search"></i>
        <div id="search-mobile-dropdown">
        </div>
        </li>
        <li><a href="/">Home</a></li>
        <li><a>Clubs</a>
        <ul class="dropdown">
        <li><a href="/discover">All Clubs</a></li>
        <li><a href="/myclubs">Your Clubs</a></li>
        </ul></li>
        <li><a>Events</a>
        <ul class="dropdown">
        <li><a href="/events">All Events</a></li>
        <li><a href="/myevents">Your Events</a></li>
        </ul></li>
        <li><a>Account</a>
        <ul class="dropdown">
        <li><a href="/profile">Profile</a></li>
        <li><a href="/notification">Settings</a></li>
        <li><a href="/logout">Log Out</a></li>
        </ul></li>
        <li><a href="/admin">Admin</a></li>
        </ul></nav>
        <button type="button" class="toggle-btn"><span class="icon">☰</span></button>
        </header>
        <header id="desktop_head_nav">
        <p>LANGEN</p>
        <nav class="navbar desktop_nav">
        <ul class="nav_links">
        <li><a href="/">Home</a></li>
        <li><div class="dropdown"><a>Clubs</a>
        <div class="dropdown-content">
        <a href="/discover">All Clubs</a>
        <a href="/myclubs">Your Clubs</a>
        </div></div></li>
        <li><div class="dropdown"><a>Events</a>
        <div class="dropdown-content">
        <a href="/events">All Events</a>
        <a href="/myevents">Your Events</a>
        </div></div></li>
        <li><div class="dropdown"><a>Account</a>
        <div class="dropdown-content">
        <a href="/profile">Profile</a>
        <a href="/notification">Settings</a>
        <a href="/logout">Log Out</a>
        </div></div></li>
        <li><a href="/admin">Admin</a></li>
        </ul></nav>
        <div class="searchStyle">
        <input type="text" placeholder="Search" class="nav_search">
        <i class="fa fa-search"></i>
        <div id="search-desktop-dropdown">
        </div>
        </div>
        </header>`);
    }
    document.body.removeChild(head);

    const toggleBtn = document.querySelector('.toggle-btn');
    const mobileNav = document.querySelector('.mobile_nav');

    toggleBtn.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });

    const dropdownToggle = document.querySelectorAll('.mobile_nav ul li a');

    dropdownToggle.forEach(function (toggle) {
      if (toggle.nextElementSibling) {
        toggle.addEventListener('click', function (e) {
          e.preventDefault();
          toggle.nextElementSibling.classList.toggle('open');
        });
      }
    });

    const links = document.querySelectorAll('.nav_links a');

    links.forEach(function (l) {
      if (l.href === window.location.href) {
        l.classList.add("current_page");
      }
    });
    let searchIcons = document.querySelectorAll(".fa-search");
    for (let i = 0; i < searchIcons.length; i++) {
      searchIcons[i].addEventListener("click", function () {
        searchItem(this);
      });
    }

    let searchBars = document.querySelectorAll(".nav_search");
    for (let i = 0; i < searchBars.length; i++) {
      searchBars[i].addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          searchItem(this);
        }
      });
    }

  }

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      create(this.responseText);
    }
  };

  xhttp.open("GET", "/role.type", true);

  xhttp.send();
}