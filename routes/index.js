var express = require('express');
const sendEmail = require("./send_Email.js");
var router = express.Router();
var multer = require('multer');
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
// for google login
const CLIENT_ID = '964575815356-j8b31jvpel0juae9va85pqpsa5io0i4k.apps.googleusercontent.com';
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
const bodyParser = require("body-parser");
const argon2 = require('argon2');
const { createApi } = require('unsplash-js');
const unsplash = createApi({
  accessKey: 'eP7c60c6koa4SGzsNAZgwvlwoYKyXxxpwIM4-aowims'
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/club/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  }
});

var upload = multer({
  storage: storage
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// should only use this for navigation bar
// to get the role of the user
router.get('/role.type', function (req, res, next) {
  // search session in database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT user.role FROM user INNER JOIN user_session WHERE user.email = user_session.user_email AND user_session.session = ?";
    connection.query(query, [req.session.id], function (err2, rows, fields) {
      connection.release();
      if (err2) {
        console.log(err2);
        res.sendStatus(500);
        return;
      }
      if (rows.length > 0) {
        res.status(200);
        res.send(rows[0].role);
        return;
      }
      res.status(200);
      res.send("guest");
      return;
    });
  });
});

// get featured club
router.get("/featured/club.json", function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query = "SELECT club.id, club.name, club.description, club.category1, member_count FROM (SELECT club.id, COUNT(club_member.club_id) AS member_count FROM club LEFT JOIN club_member ON club.id = club_member.club_id WHERE club.status = 'active' GROUP BY club.id ORDER BY member_count DESC LIMIT 5) AS r INNER JOIN club WHERE r.id = club.id ORDER BY RAND() LIMIT 1";
    connection.query(query, function (err2, rows, fields) {
      connection.release();
      if (err2) {
        console.log(err2);
        res.sendStatus(500);
        return;
      }
      if (rows.length === 0) {
        res.sendStatus(404);
        return;
      }

      unsplash.photos.getRandom({
        query: rows[0].name
      }).then((result) => {
        if (result.type === 'success') {
          const photo = result.response;
          let club = rows;
          club[0].image = {};
          club[0].image.url = photo.urls.raw;
          club[0].image.user = {};
          club[0].image.user.name = photo.user.name;
          club[0].image.user.username = photo.user.username;
          res.status(200);
          res.json(club);
        } else {
          res.status(200);
          res.json(rows);
        }
      }).catch((ue) => {
          res.status(200);
          res.json(rows);
      });
    });
  });
});

// get featured event
router.get("/featured/event.json", function (req, res, next) {
  var srow;
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query = "SELECT club.id AS club_id, club.name, event.id AS event_id, event.title, event.content, event.location, event.event_time, member_count FROM (SELECT event.id AS event_id, club.id AS club_id, COUNT(RSVP.event_id) AS member_count FROM event LEFT JOIN RSVP ON event.id = RSVP.event_id INNER JOIN club WHERE event.club_id = club.id AND event.event_time > CURTIME() GROUP BY event.id ORDER BY member_count DESC LIMIT 5) AS r INNER JOIN club INNER JOIN event WHERE r.club_id = club.id AND r.event_id = event.id ORDER BY RAND() LIMIT 1";
    connection.query(query, function (err2, rows, fields) {
      connection.release();
      if (err2) {
        console.log(err2);
        res.sendStatus(500);
        return;
      }
      if (rows.length === 0) {
        res.sendStatus(404);
        return;
      }
      srow = rows;
      for (let i = 0; i < srow.length; i++) {
        srow[i].event_time = srow[i].event_time.toISOString().slice(0, 19).replace('T', ' ');
        srow[i].event_time = srow[i].event_time.slice(0, -3);
      }

      unsplash.photos.getRandom({
        query: srow[0].name
        // use club name and not event title
        // because event title could be long and not provide good results
        // names are more likely to be concise and fully related to the club
      }).then((result) => {
        if (result.type === 'success') {
          const photo = result.response;
          let event = srow;
          event[0].image = {};
          event[0].image.url = photo.urls.raw;
          event[0].image.user = {};
          event[0].image.user.name = photo.user.name;
          event[0].image.user.username = photo.user.username;
          res.status(200);
          res.json(event);
        } else {
          res.status(200);
          res.json(srow);
        }
      }).catch((ue) => {
        res.status(200);
        res.json(srow);
    });
    });
  });
});

router.get("/posts.json", async function (req, res, next) {
  var post_details;
  var off = 0;
  if (req.query.offset) {
    off = parseInt(req.query.offset, 10);
  }
  await req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    // check if logged in
    let islogged = "SELECT user_email FROM user_session WHERE user_session.session = ?";
    connection.query(islogged, [req.session.id], function (err2, rows, fields) {
      connection.release();
      if (err2) {
        console.log(err2);
        res.sendStatus(500);
        return;
      }
      if (rows.length > 0) {
        // logged user
        let query = "SELECT username, name, post.* FROM post INNER JOIN user INNER JOIN club INNER JOIN club_member WHERE club_member.user_email = ? AND post.user_email = user.email AND post.club_id = club.id AND club_member.club_id = post.club_id AND club.status = 'active' ORDER BY timestamp DESC LIMIT 5 OFFSET ?";
        connection.query(query, [rows[0].user_email, off], function (error1, rows1, fields1) {
          connection.release();
          if (error1) {
            console.log(error1);
            res.sendStatus(500);
            return;
          }
          post_details = rows1;

          for (var i = 0; i < post_details.length; i++) {
            post_details[i].timestamp = post_details[i].timestamp.toISOString().slice(0, 19).replace('T', ' ');
            post_details[i].timestamp = post_details[i].timestamp.slice(0, -3);
          }
          res.send(post_details);
        });
      } else {
        // public user
        let query = "SELECT username, name, post.* FROM post INNER JOIN user INNER JOIN club WHERE post.user_email = user.email AND post.club_id = club.id AND visibility = 'public' AND club.status = 'active' ORDER BY timestamp DESC LIMIT 5 OFFSET ?";
        connection.query(query, [off], function (error1, rows2, fields2) {
          connection.release();
          if (error1) {
            console.log(error1);
            res.sendStatus(500);
            return;
          }
          post_details = rows2;

          for (var i = 0; i < post_details.length; i++) {
            post_details[i].timestamp = post_details[i].timestamp.toISOString().slice(0, 19).replace('T', ' ');
            post_details[i].timestamp = post_details[i].timestamp.slice(0, -3);
          }
          res.send(post_details);
        });
      }
    });
  });
});

router.get('/RSVPEvent', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT user_email FROM user_session WHERE session = ?";
    connection.query(query, [req.session.id], function (err1, rows, fields) {
      connection.release();
      if (err1) {
        console.log(err1);
        res.sendStatus(500);
        return;
      }
      if (rows[0] === undefined) {
        console.log("No user is logged in.");
        res.sendStatus(400);
      } else {
        console.log("The current user is " + rows[0].user_email);

        var query1 = "INSERT IGNORE INTO RSVP (user_email, event_id) VALUES (?, ?);";
        connection.query(query1, [rows[0].user_email, req.query.id], function (err2, row, fields1) {
          connection.release();
          if (err2) {
            res.sendStatus(500);
            return;
          }

          res.sendStatus(200);
        });
      }
    });
  });
});

router.get('/LeaveEvent', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT user_email FROM user_session WHERE session = ?";
    connection.query(query, [req.session.id], function (err1, rows, fields) {
      connection.release();
      if (err1) {
        console.log(err1);
        res.sendStatus(500);
        return;
      }
      if (rows[0] === undefined) {
        console.log("No user is logged in.");
        res.sendStatus(400);
      } else {
        console.log("The current user is " + rows[0].user_email);

        var query1 = "DELETE FROM RSVP WHERE user_email=? AND event_id=?;";
        connection.query(query1, [rows[0].user_email, req.query.id], function (err2, row, fields1) {
          connection.release();
          if (err2) {
            res.sendStatus(500);
            return;
          }
          res.sendStatus(200);
        });
      }
    });
  });
});

router.get('/ShowRSVPOrLeave', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT user_email FROM user_session WHERE session = ?";
    connection.query(query, [req.session.id], function (err1, rows, fields) {
      connection.release();
      if (err1) {
        console.log(err1);
        res.sendStatus(500);
        return;
      }
      if (rows[0] === undefined) {
        console.log("No user is logged in.");
        res.send(false);
      } else {
        console.log("The current user is " + rows[0].user_email);

        var query1 = "SELECT EXISTS(SELECT * from RSVP WHERE user_email=? AND event_id=?);";
        connection.query(query1, [rows[0].user_email, req.query.id], function (err2, row, fields1) {
          connection.release();
          if (err2) {
            res.sendStatus(500);
            return;
          }
          res.send(JSON.stringify(Object.values(row[0])));
        });
      }
    });
  });
});

router.get('/NoButtonDisplay', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT EXISTS(SELECT * FROM event WHERE event_time<=CURTIME() AND id=?);";
    connection.query(query, [req.query.id], function (err2, row, fields) {
      connection.release();
      if (err2) {
        res.sendStatus(500);
        return;
      }
      res.send(JSON.stringify(Object.values(row[0])));
    });
  });
});

router.get('/joinDisplay', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT user_email FROM user_session WHERE session = ?";
    connection.query(query, [req.session.id], function (err1, rows, fields) {
      connection.release();
      if (err1) {
        console.log(err1);
        res.sendStatus(500);
        return;
      }
      if (rows[0] === undefined) {
        console.log("No user is logged in.");
      } else {
        console.log("The current user is " + rows[0].user_email);

        var query1 = "SELECT EXISTS(SELECT * from club_member WHERE user_email=? AND club_id=?);";
        connection.query(query1, [rows[0].user_email, req.query.id], function (err2, row, fields1) {
          connection.release();
          if (err2) {
            res.sendStatus(500);
            return;
          }

          res.send(JSON.stringify(Object.values(row[0])));
        });
      }
    });
  });
});

router.get('/displayClubs', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(403);
      return;
    }

    var query = "SELECT * FROM club WHERE status='active';";
    connection.query(query, function (error, rows, fields) {
      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });

  });
});

router.get('/userClubsSearch', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var query = "SELECT user_email FROM user_session WHERE session = ?";
    connection.query(query, [req.session.id], function (err1, rows, fields) {
      if (err1) {
        connection.release();
        console.log(err1);
        res.sendStatus(500);
        return;
      }

      if (rows[0] === undefined) {
        console.log("No user is logged in.");
        res.sendStatus(400);
      } else {
        console.log("The current user is " + rows[0].user_email);

        var userInput = req.query.input;
        var query1 = "SELECT club_member.role, club.id, club.name, club.description, club.picture, club.category1, club.status FROM club INNER JOIN club_member ON club_member.club_id = club.id WHERE user_email = ? AND (club.name LIKE ? OR club.description LIKE ?)";
        connection.query(query1, [rows[0].user_email, `%${userInput}%`, `%${userInput}%`], function (err2, rows2, fields1) {
          connection.release();
          if (err2) {
            console.log(err2);
            res.sendStatus(500);
            return;
          }

          let finalrow = [];

          for (let i = 0; i < rows2.length; i++) {
            if (rows2[i].role === 'member' && rows2[i].status === 'active') {
              finalrow.push(rows2[i]);
            } else if (rows2[i].role === 'manager') {
              finalrow.push(rows2[i]);
            }
          }

          const clubNames = finalrow.map((row) => row.name);

          res.send(JSON.stringify(clubNames));
        });
      }
    });
  });
});



router.get('/displayMyClubs', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT user_email FROM user_session WHERE session = ?";
    connection.query(query, [req.session.id], function (err1, rows, fields) {
      connection.release();
      if (err1) {
        console.log(err1);
        res.sendStatus(500);
        return;
      }
      if (rows[0] === undefined) {
        console.log("No user is logged in.");
        res.sendStatus(400);
      } else {
        console.log("The current user is " + rows[0].user_email);

        var query1 = "SELECT club_member.role, club.id, club.name, club.description,club.picture, club.category1, club.status FROM club INNER JOIN club_member ON club_member.club_id=club.id WHERE user_email=?;";
        connection.query(query1, [rows[0].user_email], function (err2, row, fields1) {
          connection.release();
          if (err2) {
            res.sendStatus(500);
            return;
          }

          let finalrow = [];

          for (let i = 0; i < row.length; i++) {
            if (row[i].role === 'member' && row[i].status === 'active') {
              finalrow.push(row[i]);
            } else if (row[i].role === 'manager') {
              finalrow.push(row[i]);
            }
          }

          res.send(JSON.stringify(finalrow));
        });
      }
    });
  });
});

router.get('/displayMyRSVPEvents', function (req, res, next) {
  var sent_row;
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT user_email FROM user_session WHERE session = ?";
    connection.query(query, [req.session.id], function (err1, rows, fields) {
      connection.release();
      if (err1) {
        console.log(err1);
        res.sendStatus(500);
        return;
      }
      if (rows[0] === undefined) {
        console.log("No user is logged in.");
        res.sendStatus(400);
      } else {
        console.log("The current user is " + rows[0].user_email);

        var query1 = "SELECT event.id, event.club_id, club.name, event.title, event.location, event.event_time FROM ((club INNER JOIN event ON event.club_id=club.id) INNER JOIN RSVP ON event.id=RSVP.event_id) WHERE RSVP.user_email=? AND event.event_time>CURTIME() ORDER BY event_time ASC;";
        connection.query(query1, [rows[0].user_email], function (err2, row, fields1) {
          connection.release();
          if (err2) {
            res.sendStatus(500);
            return;
          }

          sent_row = row;

          for (var i = 0; i < sent_row.length; i++) {
            sent_row[i].event_time = sent_row[i].event_time.toISOString().slice(0, 19).replace('T', ' ');
            sent_row[i].event_time = sent_row[i].event_time.slice(0, -3);
          }

          res.send(JSON.stringify(sent_row));
        });
      }
    });
  });
});

router.get('/displayMyUpcomingEvents', function (req, res, next) {
  var sent_row;
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT user_email FROM user_session WHERE session = ?";
    connection.query(query, [req.session.id], function (err1, rows, fields) {
      connection.release();
      if (err1) {
        console.log(err1);
        res.sendStatus(500);
        return;
      }
      if (rows[0] === undefined) {
        console.log("No user is logged in.");
        res.sendStatus(400);
      } else {
        console.log("The current user is " + rows[0].user_email);


        var query1 = "SELECT event.id, event.club_id ,event.title, event.location, event.event_time, club.name FROM event INNER JOIN club ON club.id=event.club_id WHERE NOT EXISTS (SELECT event_id FROM RSVP WHERE RSVP.event_id=event.id AND RSVP.user_email=?) AND EXISTS (SELECT club_id FROM club_member WHERE club_member.club_id=event.club_id AND club_member.user_email=?)  AND event.event_time>CURDATE() ORDER BY event.event_time ASC;";
        connection.query(
          query1,
          [
            rows[0].user_email,
            rows[0].user_email
          ],
          function (err2, row, fields1) {
            connection.release();
            if (err2) {
              res.sendStatus(500);
              return;
            }

            sent_row = row;

            for (var i = 0; i < sent_row.length; i++) {
              sent_row[i].event_time = sent_row[i].event_time.toISOString().slice(0, 19).replace('T', ' ');
              sent_row[i].event_time = sent_row[i].event_time.slice(0, -3);
            }

            res.send(JSON.stringify(sent_row));
          }
        );
      }
    });
  });

});

router.get('/displayMyPreviousEvents', function (req, res, next) {
  var sent_row;
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT user_email FROM user_session WHERE session = ?";
    connection.query(query, [req.session.id], function (err1, rows, fields) {
      connection.release();
      if (err1) {
        console.log(err1);
        res.sendStatus(500);
        return;
      }
      if (rows[0] === undefined) {
        console.log("No user is logged in.");
        res.sendStatus(400);
      } else {
        console.log("The current user is " + rows[0].user_email);


        var query1 = "SELECT event.id, event.club_id, club.name, event.title, event.location, event.event_time FROM ((club INNER JOIN event ON event.club_id=club.id) INNER JOIN RSVP ON event.id=RSVP.event_id) WHERE RSVP.user_email=? AND event.event_time<=CURTIME() ORDER BY event_time DESC;";
        connection.query(
          query1,
          [
            rows[0].user_email,
            rows[0].user_email
          ],
          function (err2, row, fields1) {
            connection.release();
            if (err2) {
              res.sendStatus(500);
              return;
            }

            sent_row = row;

            for (var i = 0; i < sent_row.length; i++) {
              sent_row[i].event_time = sent_row[i].event_time.toISOString().slice(0, 19).replace('T', ' ');
              sent_row[i].event_time = sent_row[i].event_time.slice(0, -3);
            }

            res.send(JSON.stringify(sent_row));
          }
        );
      }
    });
  });

});

router.get('/displayEvents', function (req, res, next) {
  var past_event_detail = [];
  var event_detail = [];

  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(403);
      return;
    }

    var query = "SELECT event.id, event.title, event.content, event.location, event.event_time, club.name, event.club_id  FROM event INNER JOIN club ON event.club_id=club.id WHERE event_time > CURDATE() AND club.status = 'active' ORDER BY event_time ASC;";
    connection.query(query, function (error1, event_details, fields) {
      connection.release();
      if (error1) {
        res.sendStatus(500);
        return;
      }
      event_detail = event_details;

      for (let i = 0; i < event_detail.length; i++) {
        event_detail[i].event_time = event_detail[i].event_time.toISOString().slice(0, 19).replace('T', ' ');
        event_detail[i].event_time = event_detail[i].event_time.slice(0, -3);
      }

      var query1 = "SELECT event.id, event.club_id, event.title, event.content, event.location, event.event_time, club.name  FROM event INNER JOIN club ON event.club_id=club.id WHERE event_time <= CURDATE() AND club.status = 'active' ORDER BY event_time DESC;";
      connection.query(query1, function (error2, past_event_details, fields1) {
        connection.release();
        if (error2) {
          res.sendStatus(500);
          return;
        }

        past_event_detail = past_event_details;

        for (let i = 0; i < past_event_detail.length; i++) {
          past_event_detail[i].event_time = past_event_detail[i].event_time.toISOString().slice(0, 19).replace('T', ' ');
          past_event_detail[i].event_time = past_event_detail[i].event_time.slice(0, -3);
        }

        res.json(
          { upcoming: JSON.stringify(event_detail), past: JSON.stringify(past_event_detail) }
        );
      });
    });
  });
});

router.post('/insertClub', upload.single('image'), function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    var filePath = "/images/club/";
    filePath += req.file.filename;

    var query = "SELECT user_email FROM user_session WHERE session = ?";
    connection.query(query, [req.session.id], function (err1, rows, fields) {
      connection.release();
      if (err1) {
        console.log(err1);
        res.sendStatus(500);
        return;
      }
      if (rows[0] === undefined) {
        console.log("No user is logged in.");
        res.sendFile(path.resolve('./private/invalid.html'));
        return;
      }
      var query1 = 'INSERT INTO club (name, description, picture, category1) VALUES (?, ?, ?, ?);';
      connection.query(
        query1,
        [
          req.body.clubname,
          req.body.description,
          filePath,
          req.body.category
        ],
        function (error, row, fields1) {
          connection.release();
          if (error) {
            res.status(500).sendFile(path.resolve('./private/invalid.html'));
            return;
          }

          var query2 = 'SELECT id FROM club WHERE name=?';
          connection.query(query2, [req.body.clubname], function (err2, row1, fields2) {
            connection.release();
            if (err2) {
              res.status(500).sendFile(path.resolve('./private/invalid.html'));
              return;
            }

            var query3 = 'INSERT INTO club_member (user_email, club_id, role) VALUES (?, ?, "manager")';
            connection.query(
              query3,
              [
                rows[0].user_email,
                row1[0].id
              ],
              function (err3, row2, fields3) {
                connection.release();
                if (err3) {
                  console.log(err3);
                  res.status(500).sendFile(path.resolve('./private/invalid.html'));
                  return;
                }
                res.redirect('/discover.html');
              }
            );
          });
        }
      );
    });
  });
});


// hugh
// for page login
router.post('/login', async function (req, res, next) {
  if ('client_id' in req.body) {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // If request specified a G Suite domain:
    // const domain = payload['hd'];]
    // console.log(payload);
    req.pool.getConnection(function (err, connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      let selectQuery = "SELECT email FROM user WHERE email = ?;";
      let insertQuery = "INSERT INTO user (email, username, role) VALUES (?, ?, 'user');";
      let insertUserInfoQuery = "UPDATE user_info SET firstname = ?, lastname = ? WHERE user_email = ?;";
      let sessionQuery = "INSERT INTO user_session (session, user_email) VALUES (?, ?);";

      connection.query(selectQuery, [payload.email], function (error2, results2, fields2) {
        if (error2) {
          connection.release();
          res.sendStatus(500);
          return;
        }

        if (results2.length > 0) {
          connection.query(
            sessionQuery,
            [
              req.sessionID,
              payload.email
            ],
            function (error3, results3, fields3) {
              connection.release();
              if (error3) {
                console.log(error3);
                res.sendStatus(500);
                return;
              }
              console.log("User already exists.");
              res.sendStatus(200);
            }
          );
        } else {
          connection.query(
            insertQuery,
            [
              payload.email,
              payload.name
            ],
            function (error4, results4, fields4) {

              if (error4) {
                connection.release();
                console.log(error4);
                res.sendStatus(500);
                return;
              }
              connection.query(
                insertUserInfoQuery,
                [
                  payload.given_name,
                  payload.family_name,
                  payload.email
                ],
                function (error6, results6, fields6) {

                  if (error6) {
                    connection.release();
                    console.log(error6);
                    res.sendStatus(500);
                    return;
                  }
                  connection.query(
                    sessionQuery,
                    [
                      req.sessionID,
                      payload.email
                    ],
                    function (error5, results5, fields5) {
                      connection.release();
                      if (error5) {
                        console.log(error5);
                        res.sendStatus(500);
                        return;
                      }
                      res.sendStatus(200);
                    }
                  );
                }
              );
            }
          );
        }
      });
    });

  } else if ('email' in req.body && 'password' in req.body) {
    req.pool.getConnection(function (err, connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      let passwordQuery = "SELECT password FROM user WHERE email = ?;";
      let sessionQuery = "INSERT INTO user_session (session, user_email) VALUES (?, ?);";

      connection.query(passwordQuery, [req.body.email], async function (error2, results2, fields2) {
        if (error2) {
          connection.release();
          res.sendStatus(500);
          return;
        }
        if (results2.length > 0) {
          if (results2[0].password === null) {
            connection.release();
            res.sendStatus(500);
            return;
          }
        }
        if (results2.length > 0
          && await argon2.verify(results2[0].password, req.body.password)) {
          connection.query(
            sessionQuery,
            [
              req.sessionID,
              req.body.email
            ],
            function (error3, results3, fields3) {
              connection.release();
              if (error3) {
                console.log(error3);
                res.sendStatus(500);
                return;
              }
              res.sendStatus(200);
            }
          );
        } else {
          res.sendStatus(403);
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});

// for page signup
router.post('/signup', async function (req, res, next) {
  if ('username' in req.body && 'email' in req.body && 'password' in req.body) {
    req.pool.getConnection(async function (err, connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      let userCheckQuery = "SELECT email FROM user WHERE email = ?;";
      let userQuery = "INSERT INTO user (email, username, password,role) VALUES (?, ?, ?,'user');";
      let sessionQuery = "INSERT INTO user_session (session, user_email) VALUES (?, ?);";
      const hash = await argon2.hash(req.body.password);

      connection.query(
        userCheckQuery,
        [
          req.body.email
        ],
        function (error, results, fields) {
          if (error) {
            connection.release();
            res.sendStatus(500);
            return;
          }
          if (results.length === 0) {
            connection.query(
              userQuery,
              [
                req.body.email,
                req.body.username,
                hash
              ],
              function (error1, results1, fields1) {
                if (error) {
                  connection.release();
                  res.sendStatus(500);
                  return;
                }

                connection.query(
                  sessionQuery,
                  [
                    req.sessionID,
                    req.body.email
                  ],
                  function (error2, results2, fields2) {
                    connection.release();
                    if (error2) {
                      res.sendStatus(500);
                      return;
                    }
                    res.sendStatus(200);
                  }
                );
              }
            );
          } else {
            res.sendStatus(401);
          }
        }
      );
    });
  } else {
    res.sendStatus(401);
  }
});


// for page logout
router.get('/logout', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "DELETE FROM user_session WHERE session = ?;";
    connection.query(query, [req.sessionID], function (err2, rows, fields) {
      connection.release();
      if (err2) {
        console.log(err2);
        res.sendStatus(500);
        return;
      }
    });
  });
  res.status(200).redirect("/");
});
router.post('/ _info_submit', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    let userInfoUpdateQuery = "UPDATE user_info SET contact = ?, biography = ?, firstname = ?, lastname = ? WHERE user_email = (SELECT user_email FROM user_session WHERE session = ?);";
    let usernameCheckQuery = "SELECT username FROM user WHERE username = ? AND email != (SELECT user_email FROM user_session WHERE session = ?);";
    let usernameQuery = "SELECT username FROM user WHERE email = (SELECT user_email FROM user_session WHERE session = ?);";
    let userUpdateQuery = "UPDATE user SET username = ? WHERE email = (SELECT user_email FROM user_session WHERE session = ?);";
    let userPassUpdateQuery = "UPDATE user SET password = ? WHERE email = (SELECT user_email FROM user_session WHERE session = ?);";

    connection.query(
      userInfoUpdateQuery,
      [
        req.body.contact,
        req.body.biography,
        req.body.firstname,
        req.body.lastname,
        req.sessionID
      ],
      async function (error1, results1, fields1) {
        if (error1) {
          console.log(error1);
          connection.release();
          res.sendStatus(500);
          return;
        }
        if ('password' in req.body) {
          if (req.body.password !== '') {
            const hash = await argon2.hash(req.body.password);
            connection.query(
              userPassUpdateQuery,
              [
                hash,
                req.sessionID
              ],
              function (error3, results3, fields3) {
                if (error3) {
                  connection.release();
                  console.log(error3);
                  res.sendStatus(500);
                  return;
                }
              }
            );
          }
        }
        connection.query(
          usernameCheckQuery,
          [
            req.body.username,
            req.sessionID
          ],
          function (error4, results4, fields4) {
            if (error4) {
              connection.release();
              console.log(error4);
              res.sendStatus(500);
              return;
            }
            if (results4.length === 0) {
              connection.query(
                userUpdateQuery,
                [
                  req.body.username,
                  req.sessionID
                ],
                function (error2, results2, fields2) {
                  connection.release();
                  if (error2) {
                    console.log(error2);
                    res.sendStatus(500);
                    return;
                  }

                  res.sendStatus(200);
                }
              );
            } else {
              connection.query(
                usernameQuery,
                [
                  req.sessionID
                ],
                function (error5, results5, fields5) {
                  connection.release();
                  if (error5) {
                    console.log(error5);
                    res.sendStatus(500);
                    return;
                  }
                  res.status(402).send(results5[0].username);

                }
              );
            }
          }
        );
      }
    );
  });
});
router.get('/profile_load', function (req, res, next) {

  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let userCheckQuery = "SELECT user_email FROM user_session WHERE session = ?;";
    let userInfoUpdateQuery = "SELECT user_info.firstname, user_info.lastname, user_info.contact, user_info.biography, user_info.profile_picture, user.username, user.password FROM user_session JOIN user_info ON user_session.user_email = user_info.user_email JOIN user ON user_session.user_email = user.email WHERE user_session.session = ?;";
    connection.query(userCheckQuery, [req.sessionID], function (error1, results1, fields1) {
      if (error1) {
        connection.release();
        console.log(error1);
        res.sendStatus(500);
        return;
      }
      if (results1.length > 0) {
        connection.query(
          userInfoUpdateQuery,
          [
            req.sessionID
          ],
          function (error2, results2, fields2) {
            connection.release();
            if (error2) {
              console.log(error2);
              res.sendStatus(500);
              return;
            }
            const toUpdateResult = results2[0];
            if (toUpdateResult.password === null) {
              toUpdateResult.type = "social";
            } else {
              toUpdateResult.type = "normal";

            }
            delete toUpdateResult.password;
            res.status(200).send(JSON.stringify(toUpdateResult));
          }
        );
      } else {
        res.sendStatus(500);
      }

    });

  });
});
router.get('/profile_cancel', function (req, res, next) {

  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let userInfoUpdateQuery = "SELECT user_info.firstname, user_info.lastname, user_info.contact, user_info.biography, user_info.profile_picture, user.username, user.password FROM user_session JOIN user_info ON user_session.user_email = user_info.user_email JOIN user ON user_session.user_email = user.email WHERE user_session.session = ?;";

    connection.query(userInfoUpdateQuery, [req.sessionID], function (error1, results1, fields1) {
      connection.release();
      if (error1) {
        res.sendStatus(500);
        return;
      }
      res.status(200).send(JSON.stringify(results1[0]));
    });
  });
});
router.post('/profile_submit', function (req, res, next) {

  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(500);
      res.sendStatus(500);
      return;
    }

    let userQuery = "SELECT user_email FROM user_session WHERE session = ?;";
    let profileUpdateQuery = "UPDATE user_info SET profile_picture = ? WHERE user_email = (SELECT user_email FROM user_session WHERE session = ?);";

    connection.query(userQuery, [req.sessionID], function (error1, results1, fields1) {
      if (error1) {
        connection.release();
        res.sendStatus(500);
        return;
      }
      const absoluteFolderPath = path.resolve(__dirname, '../public/images/users/profile/', results1[0].user_email);
      if (fs.existsSync(absoluteFolderPath)) {
        console.log('Folder exists');
      } else {
        fs.mkdir(absoluteFolderPath, { recursive: true }, (err1) => {
          if (err1) {
            res.sendStatus(500);
            console.log(err1);
            return;
          }

        });
      }

      const imgPath = path.resolve(__dirname, '../public/images/users/profile/', results1[0].user_email);
      const form = formidable({
        multiples: true,
        uploadDir: imgPath,
        keepExtensions: true
      });

      form.parse(req, (err2, fields2, files2) => {
        if (err2) {
          console.log(err2);
          res.status(403).send();
          return;
        }
        const IMGPath = path.resolve('/images/users/profile/', results1[0].user_email, files2.avatar.newFilename);
        connection.query(
          profileUpdateQuery,
          [
            IMGPath,
            req.sessionID
          ],
          function (error3, results3, fields3) {
            connection.release();
            if (error1) {
              res.sendStatus(500);
              return;
            }
            res.status(200).send(JSON.stringify(IMGPath));
          }
        );
      });
    });
  });
});

// noti part
router.get('/get_user_email', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let userEmailQuery = "SELECT user_email FROM user_session WHERE session = ?;";
    connection.query(userEmailQuery, [req.sessionID], function (error1, results1, fields1) {
      connection.release();
      if (error1) {
        console.log(error1);
        res.sendStatus(500);
        return;
      }
      if (results1.length > 0) {
        res.status(200).send(results1[0].user_email);
      } else {
        res.sendStatus(500);
        return;
      }
    });
  });
});

router.get('/notification_setting_load', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let userInfoUpdateQuery = "SELECT club_member.club_id, club_member.receive_post_updates, club_member.receive_event_updates, club.name FROM club_member JOIN club ON club.id = club_member.club_id WHERE user_email = (SELECT user_email FROM user_session WHERE session = ?);";

    connection.query(userInfoUpdateQuery, [req.sessionID], function (error1, results1, fields1) {
      connection.release();
      if (error1) {
        console.log(error1);
        res.sendStatus(500);
        return;
      }
      res.status(200).send(JSON.stringify(results1));
    });

  });

});
router.post('/notification_setting_change', function (req, res, next) {
  let clubid = req.body.clubId;
  clubid = parseInt(clubid, 10);

  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    let allUpdateQuery = "UPDATE club_member SET receive_post_updates = ?,receive_event_updates = ? WHERE club_id = ? AND user_email IN ( SELECT user_email FROM user_session WHERE session = ?);";
    let eventUpdateQuery = "UPDATE club_member SET receive_event_updates = ? WHERE club_id = ? AND user_email IN ( SELECT user_email FROM user_session WHERE session = ?);";
    let postUpdateQuery = "UPDATE club_member SET receive_post_updates = ? WHERE club_id = ? AND user_email IN ( SELECT user_email FROM user_session WHERE session = ?);";
    let userInfoUpdateQuery = "SELECT club_member.user_email, club_member.club_id, club_member.receive_post_updates, club_member.receive_event_updates, club.name FROM club_member JOIN club ON club.id = club_member.club_id WHERE user_email = (SELECT user_email FROM user_session WHERE session = ?);";

    if ('all' in req.body) {
      let status = parseInt(req.body.all, 10);
      if (status === 1) {
        status = 0;
      } else {
        status = 1;
      }
      connection.query(
        allUpdateQuery,
        [
          status,
          status,
          clubid,
          req.sessionID
        ],
        function (error1, results1, fields1) {
          if (error1) {
            connection.release();
            console.log(error1);
            res.sendStatus(500);
            return;
          }
        }
      );
    } else if ('event' in req.body) {
      let status = parseInt(req.body.event, 10);
      if (status === 1) {
        status = 0;
      } else {
        status = 1;
      }
      connection.query(
        eventUpdateQuery,
        [
          status,
          clubid,
          req.sessionID
        ],
        function (error1, results1, fields1) {
          if (error1) {
            connection.release();
            console.log(error1);
            res.sendStatus(500);
            return;
          }
        }
      );
    } else if ('post' in req.body) {
      let status = parseInt(req.body.post, 10);
      if (status === 1) {
        status = 0;
      } else {
        status = 1;
      }
      connection.query(
        postUpdateQuery,
        [
          status,
          clubid,
          req.sessionID
        ],
        function (error1, results1, fields1) {
          if (error1) {
            connection.release();
            console.log(error1);
            res.sendStatus(500);
            return;
          }
        }
      );
    } else {
      res.sendStatus(500);
    }

    connection.query(userInfoUpdateQuery, [req.sessionID], function (error1, results1, fields1) {
      connection.release();
      if (error1) {
        console.log(error1);
        res.sendStatus(500);
        return;
      }
      res.status(200).send(JSON.stringify(results1));
    });

  });
});

router.get('/clubs_search', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    let userInfoUpdateQuery = "SELECT club_member.user_email, club_member.club_id, club_member.receive_post_updates, club_member.receive_event_updates, club.name FROM club_member JOIN club ON club.id = club_member.club_id WHERE user_email = (SELECT user_email FROM user_session WHERE session = ?);";

    connection.query(userInfoUpdateQuery, [req.sessionID], function (error1, results1, fields1) {
      connection.release();
      if (error1) {
        console.log(error1);
        res.sendStatus(500);
        return;
      }
      if ('q' in req.query) {
        var results = [];
        var q = req.query.q.toLowerCase();
        for (var i = 0; i < results1.length; i++) {
          if (results1[i].name.toLowerCase().includes(q)) {
            results.push(results1[i]);
          }
        }
        // Send matching items
        res.status(200).send(JSON.stringify(results));

      } else {

        // Otherwise send all items
        res.status(200).send(JSON.stringify(results1));

      }
    });
  });
});
// end noti part

// to send email to the manager.
router.post('/sendEmailToManager', function (req, res, next) {
  let clubid = req.body.clubId;
  clubid = parseInt(clubid, 10);
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let userEmailQuery = "SELECT user_email FROM user_session WHERE session = ?;";
    let managerEmailQuery = "SELECT user_email FROM club_member WHERE club_id = ? AND role = 'manager';";
    connection.query(managerEmailQuery, [clubid], function (error2, results2, fields2) {
      if (error2) {
        connection.release();
        console.log(error2);
        res.sendStatus(500);
        return;
      }
      if (results2.length > 0) {
        let i = 0;
        let receiver = [];
        while (i < results2.length) {
          receiver.push(results2[i].user_email);
          i++;
        }
        if ('email' in req.body) {
          connection.release();
          sendEmail(req.body.email, receiver, req.body.title, req.body.content);
          res.sendStatus(200);

        } else {
          connection.query(userEmailQuery, [req.sessionID], function (error, results, fields) {
            connection.release();
            if (error) {
              console.log(error);
              res.sendStatus(500);
              return;
            }
            if (results.length > 0) {
              let sender = results[0].user_email;
              sendEmail(sender, receiver, req.body.title, req.body.content);
              res.sendStatus(200);
            } else {
              res.sendStatus(500);
              return;
            }

          });
        }
      } else {
        console.log("none exists");
        res.sendStatus(500);
        return;
      }
    });
  });
});
// send email end

// -- set the receive notification button
router.get('/loadNotificationButton_set', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let userEmailQuery = "SELECT user_email FROM user_session WHERE session = ?;";
    let userNotiQuery = "SELECT receive_post_updates, receive_event_updates FROM club_member WHERE user_email = ? AND club_id = ?;";
    connection.query(userEmailQuery, [req.sessionID], function (err1, results1, fields1) {
      if (err1) {
        connection.release();
        console.log(err1);
        res.sendStatus(500);
        return;
      }
      if (results1.length > 0) {
        connection.query(
          userNotiQuery, [results1[0].user_email, req.query.id], function (err2, results2, fields2) {
            connection.release();
            if (err2) {
              console.log(err2);
              res.sendStatus(500);
              return;
            }
            if (results2.length > 0) {
              if (results2[0].receive_post_updates || results2[0].receive_event_updates) {
                res.status(200).send(JSON.stringify(true));
              } else {
                res.status(200).send(JSON.stringify(false));
              }
            } else {
              res.send(JSON.stringify("not joined"));
              return;
            }
          });
      } else {
        res.send(JSON.stringify("not logged in"));
        return;
      }
    });
  });
});
router.get('/receiveNotification_set', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let userEmailQuery = "SELECT user_email FROM user_session WHERE session = ?;";
    let userNotiUpdateQuery = "UPDATE club_member SET receive_post_updates = 1, receive_event_updates = 1 WHERE user_email = ? AND club_id = ?;";
    connection.query(userEmailQuery, [req.sessionID], function (err1, results1, fields1) {
      if (err1) {
        connection.release();
        console.log(err1);
        res.sendStatus(500);
        return;
      }
      if (results1.length > 0) {
        connection.query(
          userNotiUpdateQuery, [results1[0].user_email, req.query.id], function (err2, results2, fields2) {
            connection.release();
            if (err2) {
              console.log(err2);
              res.sendStatus(500);
              return;
            }
            if (results2.affectedRows === 0) {
              res.sendStatus(401);
            } else {
              res.status(200).send();
            }

          });
      } else {
        res.sendStatus(400);
        return;
      }
    });
  });
});


router.get('/cancelNotification_set', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let userEmailQuery = "SELECT user_email FROM user_session WHERE session = ?;";
    let userNotiUpdateQuery = "UPDATE club_member SET receive_post_updates = 0, receive_event_updates = 0 WHERE user_email = ? AND club_id = ?;";
    connection.query(userEmailQuery, [req.sessionID], function (err1, results1, fields1) {
      if (err1) {
        connection.release();
        console.log(err1);
        res.sendStatus(500);
        return;
      }
      if (results1.length > 0) {
        connection.query(
          userNotiUpdateQuery, [results1[0].user_email, req.query.id], function (err2, results2, fields2) {
            connection.release();
            if (err2) {
              console.log(err2);
              res.sendStatus(500);
              return;
            }
            res.status(200).send();
          });
      } else {
        res.sendStatus(500);
        return;
      }
    });
  });
});

// ------- end set receive notification button

router.get("/get_posts", async function (req, res, next) {
  let matchItems = [];
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let userEmailQuery = "SELECT user_email FROM user_session WHERE session = ?;";
    let clubListQuery = "SELECT id, name FROM club WHERE status = 'active' AND name LIKE ?;";
    let eventListQuery = "SELECT event.id, title, club_id FROM event INNER JOIN club WHERE club.id = event.club_id AND club.status = 'active' AND title LIKE ?;";
    let postListNotLoginQuery = "SELECT post.id,title, club_id FROM post INNER JOIN club WHERE club.id = post.club_id AND club.status = 'active' AND visibility = 'public' AND title LIKE ?;";
    let postListLoginQuery = "SELECT post.id, post.title, post.club_id FROM post JOIN club_member ON post.club_id = club_member.club_id AND post.user_email = club_member.user_email INNER JOIN club WHERE club.id = post.club_id AND club.status = 'active' AND club_member.user_email = ? AND post.visibility = 'private' AND post.title Like ?;";

    connection.query(userEmailQuery, [req.sessionID], function (err1, results1, fields1) {
      if (err1) {
        connection.release();
        console.log(err1);
        res.sendStatus(500);
        return;
      }
      if (req.query.q === "") {
        res.json(matchItems);
      } else {
        connection.query(clubListQuery, ['%' + req.query.q + '%'], function (error2, results2, fields2) {
          if (error2) {
            connection.release();
            console.log(error2);
            res.sendStatus(500);
            return;
          }
          if (results2.length > 0) {
            let results2Modified = results2.map((result) => ({
              ...result,
              type: "club"
            }));
            matchItems.push(...results2Modified);

          }
          connection.query(eventListQuery, ['%' + req.query.q + '%'], function (error3, results3, fields3) {
            if (error3) {
              connection.release();
              console.log(error3);
              res.sendStatus(500);
              return;
            }
            if (results3.length > 0) {
              let results3Modified = results3.map((result) => ({
                ...result,
                type: "event"
              }));
              matchItems.push(...results3Modified);
            }
            connection.query(
              postListNotLoginQuery,
              ['%' + req.query.q + '%'], function (error4, results4, fields4) {
                if (error4) {
                  connection.release();
                  console.log(error4);
                  res.sendStatus(500);
                  return;
                }
                if (results4.length > 0) {
                  let results4Modified = results4.map((result) => ({
                    ...result,
                    type: "post"
                  }));
                  matchItems.push(...results4Modified);
                }
                if (results1.length > 0) {
                  connection.query(
                    postListLoginQuery,
                    [results1[0].user_email, '%' + req.query.q + '%'], function (error5, results5, fields5) {
                      connection.release();
                      if (error5) {
                        console.log(error5);
                        res.sendStatus(500);
                        return;
                      }

                      if (results5.length > 0) {
                        let results5Modified = results5.map((result) => ({
                          ...result,
                          type: "post"
                        }));
                        matchItems.push(...results5Modified);
                      }
                      res.status(200).send(JSON.stringify(matchItems));
                    });
                } else {
                  connection.release();
                  res.status(200).send(JSON.stringify(matchItems));
                }
              });
          });
        });
      }
    });
  });
});

module.exports = router;
