var express = require('express');
var he = require('he');
var router = express.Router();

/* GET users listing. */
router.get('', function (req, res, next) {
    res.redirect('/profile');
});

router.get('/', function (req, res, next) {
    res.redirect('/profile');
});

router.get('/:username', function (req, res, next) {

    if (!req.params.username) {
        res.redirect('/profile');
    }
    req.pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        var query = "SELECT user.username, user_info.* FROM user INNER JOIN user_info WHERE user.email = user_info.user_email AND user.username = ?";
        connection.query(query, [req.params.username], function (err2, rows, fields) {
            connection.release();
            if (err2) {
                console.log(err2);
                res.sendStatus(500);
                return;
            }
            if (rows.length === 0) {
                res.status(404).redirect('/unknown');
            } else {

                res.send(`

                <html lang="en">

                <head>
                    <meta charset="UTF-8">
                    <title>${he.encode(rows[0].username)}</title>
                    <link rel="stylesheet" type="text/css" href="../stylesheets/profile.css">
                    <link rel="stylesheet" type="text/css" href="../stylesheets/nav.css">


                </head>

                <body onload="autoResize();get_nav();">
                    <header id="head_nav"></header>

                    <div id="mainBody">
                        <div id="row">
                            <div id="e_infor">
                                <div id="avatar">
                                    <div class="avatar-container">
                                        <img src="../${he.encode(rows[0].profile_picture)}" alt="User Avatar" class="avatar" id="profile_pic">
                                    </div>
                                </div>
                                <div id="text_body">
                                        <span class="e_title">Username: </span><br>
                                        <p id="username">${he.encode(rows[0].username)}</p><br>
                                        <span class="e_title">First Name: </span><br>
                                        <p id="firstname">${he.encode(rows[0].firstname)}</p><br>
                                        <span class="e_title">Last Name: </span><br>
                                        <p id="lastname">${he.encode(rows[0].lastname)}</p><br>
                                        <span class=" e_title">Contact Details:</span><br>
                                        <p id="contact_text">${he.encode(rows[0].contact)}</p><br>
                                        <span class="e_title">Biography:</span><br>
                                        <p id="bio_text">${he.encode(rows[0].biography)}</p<br>
                                </div>
                            </div>
                        </div>
                    </div>
                    <script src=" https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"
                        integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe"
                        crossorigin="anonymous"></script>
                    <script src="https://kit.fontawesome.com/41381684e7.js" crossorigin="anonymous"></script>
                    <script type="text/javascript" src="../javascripts/nav.js"></script>
                    <script type="text/javascript" src="../javascripts/users.js"></script>
                </body>
                </html>
                `);
            }
        });
    });
});

module.exports = router;
