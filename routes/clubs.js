var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
var multer = require('multer');
const bodyParser = require("body-parser");
const sendEmail = require("./send_Email.js");


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/club/post");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files are allowed'), false); // Reject the file
  }
};

var upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/* PUBLIC ROUTES FOR USERS */

router.get('/', function (req, res, next) {
  res.redirect('/discover');
});

/* CHECK IF THE CLUB IS CLOSED OR PENDING (MUST BE MANAGER OR ADMIN) */

router.get('/:id*', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    let club_check = "SELECT status FROM club WHERE id = ?";
    connection.query(club_check, [req.params.id], function (error, status, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }

      if (status.length === 0) {
        // club does not exist
        res.redirect('/discover');
      } else if (status[0].status === "active") {
        next();
      } else {
        // club is pending or closed
        let user_check = "(SELECT user.role FROM user WHERE user.email = (SELECT user_email FROM user_session WHERE session = ?)) UNION (SELECT club_member.role FROM club_member WHERE club_member.user_email = (SELECT user_email FROM user_session WHERE session = ?) and club_member.club_id = ?)";
        connection.query(
          user_check,
          [
            req.session.id,
            req.session.id,
            req.params.id
          ],
          function (error1, user, fields1) {
            connection.release();
            if (error1) {
              console.log(error1);
              res.sendStatus(500);
              return;
            }

            if (user.length === 0) {
              // user does not exist
              res.redirect('/discover');
            } else if (user.length === 1) {
              // user is not member of club
              if (user[0].role === "admin") {
                next();
              } else {
                res.redirect('/discover');
              }
            } else if (user.length === 2) {
              // user is member of club
              if (user[0].role === "admin" || user[1].role === "manager") {
                next();
              } else {
                res.redirect('/discover');
              }
            } else {
              res.redirect('/discover');
            }
          }
        );
      }
    });
  });
});

router.get('/:id', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(403);
      return;
    }

    let club_details;
    let event_detail;
    let past_event_detail;
    let post_detail;
    let member_detail;
    let manager_detail;

    var query = "SELECT * FROM club WHERE id=?;";
    connection.query(query, [req.params.id], function (error, rows, fields) {
      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }
      [club_details] = rows;

      var query1 = "SELECT * FROM event WHERE club_id=? AND event_time > CURDATE() ORDER BY event_time ASC;";
      connection.query(query1, [req.params.id], function (error1, event_details, fields1) {
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

        var query2 = "SELECT * FROM event WHERE club_id=? AND event_time <= CURDATE() ORDER BY event_time DESC;";
        connection.query(query2, [req.params.id], function (error2, past_event_details, fields2) {
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

          var memcheckquery = "SELECT * FROM club_member WHERE club_id = ? AND user_email = (SELECT user_email FROM user_session WHERE session = ?)";
          connection.query(
            memcheckquery,
            [
              req.params.id,
              req.session.id
            ],
            function (error3, user, fields3) {
              connection.release();
              if (error3) {
                res.sendStatus(500);
                return;
              }

              var admincheckquery = "SELECT role FROM user WHERE email = (SELECT user_email FROM user_session WHERE session = ?)";
              connection.query(
                admincheckquery,
                [
                  req.session.id
                ],
                function (error7, auser, fields7) {
                  connection.release();
                  if (error7) {
                    res.sendStatus(500);
                    return;
                  }
                  var query4 = "SELECT username, club_member.* FROM club_member INNER JOIN user WHERE club_id=? AND club_member.user_email = user.email;";
                  connection.query(
                    query4,
                    [
                      req.params.id
                    ],
                    function (error4, member_details, fields4) {
                      connection.release();
                      if (error4) {
                        res.sendStatus(500);
                        return;
                      }
                      member_detail = member_details;
                      var query5;
                      if (auser.length === 0) {
                        // user does not exist
                        query5 = "SELECT username, name, post.* FROM post INNER JOIN user INNER JOIN club WHERE club.id = ? AND post.user_email = user.email AND post.club_id = club.id AND visibility = 'public' ORDER BY timestamp DESC";
                      } else if (user.length === 0 && auser[0].role === "user") {
                        // user is not a member and is not an admin
                        query5 = "SELECT username, name, post.* FROM post INNER JOIN user INNER JOIN club WHERE club.id = ? AND post.user_email = user.email AND post.club_id = club.id AND visibility = 'public' ORDER BY timestamp DESC";
                      } else if (user.length === 0 && auser[0].role === "admin") {
                        // user is not a member and is an admin
                        query5 = "SELECT username, name, post.* FROM post INNER JOIN user INNER JOIN club WHERE club.id = ? AND post.user_email = user.email AND post.club_id = club.id ORDER BY timestamp DESC";
                      } else {
                        // user is a member
                        query5 = "SELECT username, name, post.* FROM post INNER JOIN user INNER JOIN club WHERE club.id = ? AND post.user_email = user.email AND post.club_id = club.id ORDER BY timestamp DESC";
                      }
                      connection.query(
                        query5,
                        [
                          req.params.id
                        ],
                        function (error5, post_details1, fields5) {
                          connection.release();
                          if (error5) {
                            res.sendStatus(500);
                            return;
                          }
                          post_detail = post_details1;

                          for (let i = 0; i < post_detail.length; i++) {
                            post_detail[i].timestamp = post_detail[i].timestamp.toISOString().slice(0, 19).replace('T', ' ');
                            post_detail[i].timestamp = post_detail[i].timestamp.slice(0, -3);
                          }

                          var query6 = "SELECT club_member.user_email, user_info.profile_picture FROM club_member INNER JOIN user_info ON club_member.user_email = user_info.user_email WHERE club_id=? AND role='manager';";
                          connection.query(
                            query6,
                            [
                              req.params.id
                            ],
                            function (error6, manager_details, fields6) {
                              connection.release();
                              if (error6) {
                                res.sendStatus(500);
                                return;
                              }
                              manager_detail = manager_details;
                              // check if user is manager
                              var mquery = "SELECT role FROM club_member WHERE user_email = (SELECT user_email FROM user_session WHERE session = ?) AND club_id = ?";
                              connection.query(
                                mquery,
                                [
                                  req.session.id,
                                  req.params.id
                                ],
                                function (e, u, f) {
                                connection.release();
                                if (e) {
                                  console.log(e);
                                  res.sendStatus(500);
                                  return;
                                }
                                if (u.length === 0) {
                                  // user is not member of club
                                  res.render(path.resolve("./views/club"), {
                                    rows: club_details,
                                    events: event_detail,
                                    past_events: past_event_detail,
                                    posts: post_detail,
                                    members: member_detail,
                                    managers: manager_detail,
                                    m: false
                                  });
                                } else if (u[0].role === "manager") {
                                  // user is manager
                                  res.render(path.resolve("./views/club"), {
                                    rows: club_details,
                                    events: event_detail,
                                    past_events: past_event_detail,
                                    posts: post_detail,
                                    members: member_detail,
                                    managers: manager_detail,
                                    m: true
                                  });
                                } else {
                                  // user is member
                                  res.render(path.resolve("./views/club"), {
                                    rows: club_details,
                                    events: event_detail,
                                    past_events: past_event_detail,
                                    posts: post_detail,
                                    members: member_detail,
                                    managers: manager_detail,
                                    m: false
                                  });
                                }
                              }
                              );
                            }
                          );
                        }
                        );
                    }
                    );
                }
              );
            }
          );

        });
      });
    });

  });
});


router.get('/:id/join', function (req, res, next) {
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

        var query1 = "INSERT IGNORE INTO club_member (user_email, club_id) VALUES (?, ?);";
        connection.query(
          query1,
          [
            rows[0].user_email,
            req.params.id
          ],
          function (err2, row, fields1) {
            connection.release();
            if (err2) {
              res.sendStatus(500);
              return;
            }

            res.redirect('/clubs/' + req.params.id);
          }
          );
      }
    });
  });
});

router.get('/:id/leave', function (req, res, next) {
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
        var query1 = "DELETE FROM club_member WHERE user_email=? AND club_id=?;";
        connection.query(
          query1,
          [
            rows[0].user_email,
            req.params.id
          ],
          function (err2, row, fields1) {
            connection.release();
            if (err2) {
              res.sendStatus(500);
              return;
            }
            res.redirect('/clubs/' + req.params.id);
          }
          );
      }
    });
  });
});

router.get('/:id/posts/new', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT COUNT(*) AS found FROM club_member INNER JOIN user_session WHERE club_member.user_email = user_session.user_email AND club_member.role = \"manager\" AND club_member.club_id = ? AND user_session.session = ?";
    connection.query(query, [req.params.id, req.session.id], function (err2, rows, fields) {
      connection.release();
      if (err2) {
        console.log(err2);
        res.sendStatus(500);
        return;
      }
      if (rows[0].found > 0) {
        var getname = "SELECT id, name FROM club WHERE id = ?";
        connection.query(getname, [req.params.id], function (err3, rows1, fields1) {
          if (err3) {
            console.log(err3);
            res.sendStatus(500);
            return;
          }
          if (rows1.length > 0) {
            res.render(path.resolve("./views/new_post"), {
              name: rows1[0].name,
              id: rows1[0].id
            });
          } else {
            res.status(403);
            res.redirect("/clubs/" + req.params.id);
            return;
          }
        });
      } else {
        res.status(403);
        res.redirect("/clubs/" + req.params.id);
        return;
      }
    });
  });
});

router.get('/:id/events/new', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT COUNT(*) AS found FROM club_member INNER JOIN user_session WHERE club_member.user_email = user_session.user_email AND club_member.role = \"manager\" AND club_member.club_id = ? AND user_session.session = ?";
    connection.query(query, [req.params.id, req.session.id], function (err2, rows, fields) {
      connection.release();
      if (err2) {
        console.log(err2);
        res.sendStatus(500);
        return;
      }
      if (rows[0].found > 0) {
        var getname = "SELECT id, name FROM club WHERE id = ?";
        connection.query(getname, [req.params.id], function (err3, rows1, fields1) {
          if (err3) {
            console.log(err3);
            res.sendStatus(500);
            return;
          }
          if (rows1.length > 0) {
            res.render(path.resolve("./views/new_event"), {
              name: rows1[0].name,
              id: rows1[0].id
            });
          } else {
            res.status(403);
            res.redirect("/clubs/" + req.params.id);
            return;
          }
        });
      } else {
        res.status(403);
        res.redirect("/clubs/" + req.params.id);
        return;
      }
    });
  });
});

/* CHECK IF THE POST IS PRIVATE (MUST BE CLUB MEMBER OR ADMIN) */

router.get('/:cid/posts/:pid', async function (req, res, next) {
  var post_details;
  await req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    let currUser = "SELECT * FROM club_member WHERE club_id = ? AND user_email = (SELECT user_email FROM user_session WHERE user_session.session = ?)";
    connection.query(currUser, [req.params.cid, req.session.id], function (error3, user, fields) {
      connection.release();
      if (error3) {
        console.log(error3);
        res.sendStatus(500);
        return;
      }
      let query = "SELECT username, name, post.* FROM post INNER JOIN user INNER JOIN club WHERE club.id = ? AND post.id = ? AND post.user_email = user.email AND post.club_id = club.id LIMIT 1";
      connection.query(query, [req.params.cid, req.params.pid], function (error4, rows, fields1) {
        connection.release();
        if (error4) {
          console.log(error3);
          res.sendStatus(500);
          return;
        }

        if (rows.length === 0) {
          // post does not exist
          res.redirect("/clubs/" + req.params.cid);
        } else if (rows[0].visibility === "private" && user.length === 0) {
          // post is private and user is not a member
          // check if they are admin
          let aquery = "SELECT role FROM user WHERE email = (SELECT user_email FROM user_session WHERE session = ?)";
          connection.query(
            aquery,
            [
              req.session.id
            ],
            function (error5, auser, fields2) {
              connection.release();
              if (error5) {
                console.log(error3);
                res.sendStatus(500);
                return;
              }
              if (auser.length === 0) {
                // user does not exist
                res.redirect("/clubs/" + req.params.cid);
              } else if (auser[0].role === "admin") {
                // user is admin
                post_details = rows;

                for (var i = 0; i < post_details.length; i++) {
                  post_details[i].timestamp = post_details[i].timestamp.toISOString().slice(0, 19).replace('T', ' ');
                  post_details[i].timestamp = post_details[i].timestamp.slice(0, -3);
                }

                res.render(path.resolve("./views/post"), { post: post_details[0], d: true });
              } else {
                // user is not admin
                res.redirect("/clubs/" + req.params.cid);
              }
            }
          );
        } else if (rows[0].visibility === "private" && user.length > 0) {
          // post is private and user is member
          // check if they are admin or manager
          let aquery = "SELECT role FROM user WHERE email = (SELECT user_email FROM user_session WHERE session = ?)";
          connection.query(
            aquery,
            [
              req.session.id
            ],
            function (error5, auser, fields2) {
              connection.release();
              if (error5) {
                console.log(error3);
                res.sendStatus(500);
                return;
              }
              if (auser.length === 0) {
                // user does not exist
                res.redirect("/clubs/" + req.params.cid);
              } else if (auser[0].role === "admin" || user[0].role === "manager") {
                // user is admin or manager
                post_details = rows;

                for (var i = 0; i < post_details.length; i++) {
                  post_details[i].timestamp = post_details[i].timestamp.toISOString().slice(0, 19).replace('T', ' ');
                  post_details[i].timestamp = post_details[i].timestamp.slice(0, -3);
                }

                res.render(path.resolve("./views/post"), { post: post_details[0], d: true });
              } else {
                // user is not admin or manager
                res.render(path.resolve("./views/post"), { post: post_details[0], d: false });
              }
            }
          );
        } else {
          // post is public
          post_details = rows;

          for (var i = 0; i < post_details.length; i++) {
            post_details[i].timestamp = post_details[i].timestamp.toISOString().slice(0, 19).replace('T', ' ');
            post_details[i].timestamp = post_details[i].timestamp.slice(0, -3);
          }

          let user_check = "(SELECT user.role FROM user WHERE user.email = (SELECT user_email FROM user_session WHERE session = ?)) UNION (SELECT club_member.role FROM club_member WHERE club_member.user_email = (SELECT user_email FROM user_session WHERE session = ?) and club_member.club_id = ?)";
          connection.query(
            user_check,
            [
              req.session.id,
              req.session.id,
              req.params.cid
            ],
            function (error1, puser, fields2) {
              connection.release();
              if (error1) {
                console.log(error1);
                res.sendStatus(500);
                return;
              }

              if (puser.length === 0) {
                // user does not exist
                res.render(path.resolve("./views/post"), { post: post_details[0], d: false });
              } else if (puser.length === 1) {
                // user is not member of club
                res.render(path.resolve("./views/post"), { post: post_details[0], d: false });
                if (puser[0].role === "admin") {
                  // user is admin
                  res.render(path.resolve("./views/post"), { post: post_details[0], d: true });
                } else {
                  // user is not admin
                  res.render(path.resolve("./views/post"), { post: post_details[0], d: false });
                }
              } else if (puser.length === 2) {
                // user is member of club
                if (puser[0].role === "admin" || puser[1].role === "manager") {
                  // user is admin or manager
                  res.render(path.resolve("./views/post"), { post: post_details[0], d: true });
                } else {
                  // user is not an admin or manager
                  res.render(path.resolve("./views/post"), { post: post_details[0], d: false });
                }
              }
            }
          );
        }
      });
    });
  });
});

router.get('/:id/addManagers', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var query = 'SELECT user_email FROM club_member WHERE club_id=? AND role="member";';
    connection.query(query, [req.params.id], function (err2, row, fields) {
      connection.release();
      if (err2) {
        res.sendStatus(500);
        return;
      }

      res.send(JSON.stringify(row));
    });
  });
});

router.get('/:id/events/:eid', function (req, res, next) {
  var sent_row;
  var sent_coordinator = {};
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    var query = 'SELECT event.id, club_id, name, title, content, location, event_time FROM event INNER JOIN club ON club.id=event.club_id WHERE event.id=?;';
    connection.query(query, [req.params.eid], function (error, rows, fields) {
      connection.release();
      if (error) {
        res.status(500).sendFile(path.resolve('./private/invalid.html'));
        return;
      }

      if (rows.length !== 0) {
        [sent_row] = rows;
        sent_row.event_time = sent_row.event_time.toISOString().slice(0, 19).replace('T', ' ');
        sent_row.event_time = sent_row.event_time.slice(0, -3);
      }

      var query1 = 'SELECT * FROM event_coordinator WHERE event_id=?;';
      connection.query(query1, [req.params.eid], function (error2, coordinator, fields1) {
        connection.release();
        if (error2) {
          res.status(500).sendFile(path.resolve('./private/invalid.html'));
          return;
        }

        if (coordinator.length === 0) {
          sent_coordinator.user_email = "No coordinator";
          sent_coordinator.manager_phone = 0;
        } else {
          [sent_coordinator] = coordinator;
        }


        if (sent_coordinator === undefined) {
          sent_coordinator = { user_email: 'DELETED USER', event_id: req.params.eid, manager_phone: 'DELETED USER' };
        }

        var query2 = 'SELECT user.username FROM RSVP INNER JOIN user WHERE RSVP.user_email=user.email AND RSVP.event_id=?;';
        connection.query(query2, [req.params.eid], function (error3, rsvp, fields3) {
          connection.release();
          if (error2) {
            res.status(500).sendFile(path.resolve('./private/invalid.html'));
            return;
          }
          res.render(path.resolve("./views/event"), { rows: sent_row, coord: sent_coordinator, rsvpList: rsvp });
        });
      });
    });
  });
});

router.get('/:id/events/:eid/edit', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let eventInfoQuery = "SELECT event.id, club_id, name, title, content, location, event_time FROM event INNER JOIN club ON club.id=event.club_id WHERE event.id=?;";
    let phoneQuery = "SELECT user_email,manager_phone FROM event_coordinator WHERE event_id = ?;";
    let eventid = req.params.eid;

    connection.query(
      eventInfoQuery,
      [eventid],
      function (error, results, fields) {
        if (error) {
          connection.release();
          console.log(error);
          res.sendStatus(500);
          return;
        }
        if (results.length > 0) {
          connection.query(phoneQuery, [eventid], function (error2, results2, fields2) {
            connection.release();
            if (error2) {
              console.log(error2);
              res.sendStatus(500);
              return;
            }
            if (results2.length > 0) {
              const infor = results[0];
              infor.manager_phone = results2[0].manager_phone;
              infor.user_email = results2[0].user_email;
              // res.render(path.resolve("./views/edit_event"), { infor: infor, id: req.params.id, eid: req.params.eid });

              var query2 = 'SELECT user.username FROM RSVP INNER JOIN user WHERE RSVP.user_email=user.email AND RSVP.event_id=?;';
              connection.query(query2, [eventid], function (error3, rsvp, fields3) {
                connection.release();
                if (error3) {
                  res.status(500).sendFile(path.resolve('./private/invalid.html'));
                  return;
                }
                res.render(path.resolve("./views/edit_event"), { infor: infor, id: req.params.id, eid: req.params.eid, rsvpList: rsvp, clubDetails: results});
              });
              } else {
                res.sendStatus(401);
                return;
              }
          });
        }
      });
  });
});

/* DELETE POSTS AND EVENTS FOR MANAGERS */

router.get('/:cid/posts/:pid/delete', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    let user_check = "(SELECT user.role FROM user WHERE user.email = (SELECT user_email FROM user_session WHERE session = ?)) UNION (SELECT club_member.role FROM club_member WHERE club_member.user_email = (SELECT user_email FROM user_session WHERE session = ?) and club_member.club_id = ?)";
    connection.query(
      user_check,
      [
        req.session.id,
        req.session.id,
        req.params.cid
      ],
      function (error1, user, fields1) {
        connection.release();
        if (error1) {
          console.log(error1);
          res.sendStatus(500);
          return;
        }

        if (user.length === 0) {
          // user does not exist
          res.redirect('/clubs/' + req.params.cid);
        } else if (user.length === 1) {
          // user is not member of club
          if (user[0].role === "admin") {
            // delete post
            let dquery = "DELETE FROM post WHERE club_id = ? AND id = ?";
            connection.query(
              dquery,
              [
                req.params.cid,
                req.params.pid
              ],
              function (error2, r, fields2) {
                connection.release();
                if (error2) {
                  console.log(error1);
                  res.sendStatus(500);
                  return;
                }
                res.redirect('/clubs/' + req.params.cid);
              }
            );
          } else {
            res.redirect('/clubs/' + req.params.cid + "/posts/" + req.params.pid);
          }
        } else if (user.length === 2) {
          // user is member of club
          if (user[0].role === "admin" || user[1].role === "manager") {
            // delete post
            let dquery = "DELETE FROM post WHERE club_id = ? AND id = ?";
            connection.query(
              dquery,
              [
                req.params.cid,
                req.params.pid
              ],
              function (error2, r, fields2) {
                connection.release();
                if (error2) {
                  console.log(error1);
                  res.sendStatus(500);
                  return;
                }
                res.redirect('/clubs/' + req.params.cid);
              }
            );
          } else {
            res.redirect('/clubs/' + req.params.cid + "/posts/" + req.params.pid);
          }
        } else {
          res.redirect('/clubs/' + req.params.cid + "/posts/" + req.params.pid);
        }
      }
    );
  });
});

router.get('/:cid/events/:eid/delete', function (req, res, next) {
  var send_emails = [];
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    let user_check = "(SELECT user.role FROM user WHERE user.email = (SELECT user_email FROM user_session WHERE session = ?)) UNION (SELECT club_member.role FROM club_member WHERE club_member.user_email = (SELECT user_email FROM user_session WHERE session = ?) and club_member.club_id = ?)";
    connection.query(
      user_check,
      [
        req.session.id,
        req.session.id,
        req.params.cid
      ],
      function (error1, user, fields1) {
        connection.release();
        if (error1) {
          console.log(error1);
          res.sendStatus(500);
          return;
        }

        if (user.length === 0) {
          // user does not exist
          res.redirect('/clubs/' + req.params.cid);
        } else if (user.length === 1) {
          // user is not member of club
          if (user[0].role === "admin") {
            // delete event
            let dquery = "DELETE FROM event WHERE club_id = ? AND id = ?";
            connection.query(
              dquery,
              [
                req.params.cid,
                req.params.eid
              ],
              function (error2, delete1, fields2) {
                connection.release();
                if (error2) {
                  console.log(error1);
                  res.sendStatus(500);
                  next();
                  return;
                }
                var notify = "(SELECT name FROM club WHERE id = ?) UNION (SELECT username FROM user INNER JOIN user_session WHERE user.email = user_session.user_email AND session = ?) UNION (SELECT user_email FROM club_member WHERE club_id = ? AND receive_event_updates = true)";
                connection.query(
                  notify,
                  [
                    req.params.cid,
                    req.session.id,
                    req.params.cid
                  ],
                  function (err3, r, fields3) {
                    connection.release();
                    if (err3) {
                      console.log(err3);
                      res.sendStatus(500);
                      return;
                    }
                    console.log(r);
                    if (r.length <= 1) {
                      console.log("error here");
                      res.sendStatus(500);
                      return;
                    }

                    for (let i = 2; i < r.length; i++) {
                      send_emails.push(r[i].name);
                    }

                    sendEmail("<No-Reply>", send_emails, "Event (" + r[0].name + ") Deleted", r[1].name + " Deleted the event titled " + req.query.title + " in " + r[0].name + ".", r[0].name);
                  }
                );
                res.redirect('/clubs/' + req.params.cid);
                return;
              }
            );
          } else {
            res.redirect('/clubs/' + req.params.cid + "/events/" + req.params.eid);
            return;
          }
        } else if (user.length === 2) {
          // user is member of club
          if (user[0].role === "admin" || user[1].role === "manager") {
            // delete post
            let dquery = "DELETE FROM event WHERE club_id = ? AND id = ?";
            connection.query(
              dquery,
              [
                req.params.cid,
                req.params.eid
              ],
              function (error2, delete2, fields2) {
                connection.release();
                if (error2) {
                  console.log(error1);
                  res.sendStatus(500);
                  next();
                  return;
                }
                var notify2 = "(SELECT name FROM club WHERE id = ?) UNION (SELECT username FROM user INNER JOIN user_session WHERE user.email = user_session.user_email AND session = ?) UNION (SELECT user_email FROM club_member WHERE club_id = ? AND receive_event_updates = true);";
                connection.query(
                  notify2,
                  [
                    req.params.cid,
                    req.session.id,
                    req.params.cid
                  ],
                  function (err4, r1, fields5) {
                    connection.release();
                    if (err4) {
                      console.log(err4);
                      res.sendStatus(500);
                      return;
                    }
                    console.log(r1);
                    if (r1.length <= 1) {
                      console.log("error here");
                      res.sendStatus(500);
                      return;
                    }

                    for (let i = 2; i < r1.length; i++) {
                      send_emails.push(r1[i].name);
                    }
                    console.log("error NOT UNTIL here");
                    sendEmail("<No-Reply>", send_emails, "Event Deleted (" +r1[0].name + ")", r1[1].name + " Deleted the event titled " + req.query.title + " in " + r1[0].name + ".", r1[0].name);
                  }
                );
                res.redirect('/clubs/' + req.params.cid);
                return;
              }
            );
          } else {
            res.redirect('/clubs/' + req.params.cid + "/events/" + req.params.eid);
            return;
          }
        } else {
          res.redirect('/clubs/' + req.params.cid + "/events/" + req.params.eid);
          return;
        }
      }
    );
  });
});

/* PRIVATE ROUTES FOR MANAGERS */

router.use(upload.single('image'));

/* Handle all POST routes for clubs */
// authenticate manager
router.post('*', function (req, res, next) {
  if (!req.body.id) {
    res.sendStatus(400);
    if (req.file) {
      fs.unlink("./public/images/club/post" + req.file.filename, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
  }
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT COUNT(*) AS found FROM club_member INNER JOIN user_session WHERE club_member.user_email = user_session.user_email AND club_member.role = \"manager\" AND club_member.club_id = ? AND user_session.session = ?";
    connection.query(query, [req.body.id, req.session.id], function (err2, rows, fields) {
      connection.release();
      if (err2) {
        console.log(err2);
        res.sendStatus(500);
        return;
      }
      if (rows[0].found > 0) {
        next();
      } else {
        if (req.file) {
          fs.unlink("./public/images/club/post" + req.file.filename, (err1) => {
            if (err1) {
              console.error(err1);
              return;
            }
          });
        }
        res.status(403);
        res.sendFile(path.resolve("./private/invalid.html"));
        return;
      }
    });
  });
});

/* CLUB POST ROUTES */

router.post('/:id/posts/new', function (req, res, next) {
  var send_emails = [];
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    if (req.file) {
      // post with image
      var filePath = "/images/club/post/";
      filePath += req.file.filename;

      var query = "INSERT INTO post (user_email, club_id, title, content, picture, visibility) VALUES ((SELECT user_email FROM user_session WHERE session = ?), ?, ?, ?, ?, ?)";
      connection.query(
        query,
        [
          req.session.id,
          req.body.id,
          req.body.title,
          req.body.content,
          filePath,
          req.body.visibility
        ],
        function (err2, rows, fields) {
          connection.release();
          if (err2) {
            console.log(err2);
            res.sendStatus(500);
            return;
          }
          // post successful
          var notify = "(SELECT name FROM club WHERE id = ?) UNION (SELECT username FROM user INNER JOIN user_session WHERE user.email = user_session.user_email AND session = ?) UNION (SELECT user_email FROM club_member WHERE club_id = ? AND receive_post_updates = true)";
          connection.query(
            notify,
            [
              req.body.id,
              req.session.id,
              req.body.id
            ],
            function (err3, r, fields1) {
              connection.release();
              if (err3) {
                console.log(err3);
                res.sendStatus(500);
                return;
              }

              if (r.length <= 1) {
                res.sendStatus(500);
                return;
              }

              for (let i = 2; i < r.length; i++) {
                send_emails.push(r[i].name);
              }

              sendEmail("<No-Reply>", send_emails, "New Post (" + r[0].name + ")", r[1].name + " made a new post in " + r[0].name + ".", r[0].name);
              res.send(`${rows.insertId}`);
            }
          );
        }
      );
    } else {
      // post without image
      var nquery = "INSERT INTO post (user_email, club_id, title, content, visibility) VALUES ((SELECT user_email FROM user_session WHERE session = ?), ?, ?, ?, ?)";
      connection.query(
        nquery,
        [
          req.session.id,
          req.body.id,
          req.body.title,
          req.body.content,
          req.body.visibility
        ],
        function (err2, rows, fields) {
          connection.release();
          if (err2) {
            console.log(err2);
            res.sendStatus(500);
            return;
          }
          // post successful
          var notify = "(SELECT name FROM club WHERE id = ?) UNION (SELECT username FROM user INNER JOIN user_session WHERE user.email = user_session.user_email AND session = ?) UNION (SELECT user_email FROM club_member WHERE club_id = ? AND receive_post_updates = true)";
          connection.query(
            notify,
            [
              req.body.id,
              req.session.id,
              req.body.id
            ],
            function (err3, r, fields1) {
              connection.release();
              if (err3) {
                console.log(err3);
                res.sendStatus(500);
                return;
              }

              if (r.length <= 1) {
                res.sendStatus(500);
                return;
              }

              for (let i = 2; i < r.length; i++) {
                send_emails.push(r[i].name);
              }

              sendEmail("<No-Reply>", send_emails, "New Post (" + r[0].name + ")", r[1].name + " made a new post in " + r[0].name + ".", r[0].name);
              res.send(`${rows.insertId}`);
            }
          );
        }
      );
    }
  });
});

router.post('/:id/editDesc', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var query = "UPDATE club SET description=? WHERE id=?;";
    connection.query(query, [req.body.updatedText, req.body.id], function (err2, row, fields) {
      connection.release();
      if (err2) {
        res.sendStatus(500);
        return;
      }

      res.redirect('/clubs/' + req.params.id);
    });

  });
});

router.post('/:id/addNewManager', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    var query = 'UPDATE club_member SET role="manager" WHERE club_id=? AND user_email=?;';
    connection.query(query, [req.body.id, req.body.newManager], function (error, rows, fields) {
      connection.release();
      if (error) {
        res.status(500).sendFile(path.resolve('./private/invalid.html'));
        return;
      }
      res.redirect('/clubs/' + encodeURIComponent(req.body.id));
    });
  });
});

router.post('/:id/events/create', function (req, res, next) {
  var send_emails = [];
  req.pool.getConnection(function (err, connection) {
    if (err) {
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
        res.sendFile(path.resolve('./private/invalid.html'));
        return;
      }

      console.log("The current user is " + rows[0].user_email);
      var query1 = 'INSERT IGNORE INTO event (club_id, title, content, location, event_time) VALUES (?, ?, ?, ?, ?);';
      connection.query(
        query1,
        [
          req.body.id,
          req.body.event_title,
          req.body.event_content,
          req.body.event_location,
          req.body.event_time
        ],
        function (error, row, fields1) {
          connection.release();
          if (error) {
            res.status(500).sendFile(path.resolve('./private/invalid.html'));
            return;
          }
            var query3 = 'INSERT INTO event_coordinator (user_email, event_id, manager_phone) VALUES (?, ?, ?)';
            connection.query(
              query3,
              [
                rows[0].user_email,
                row.insertId,
                req.body.event_number
              ],
              function (err3, row2, fields3) {
                connection.release();
                if (err3) {
                  console.log(err3);
                  res.status(500).sendFile(path.resolve('./private/invalid.html'));
                  return;
                }

                var notify = "(SELECT name FROM club WHERE id = ?) UNION (SELECT username FROM user INNER JOIN user_session WHERE user.email = user_session.user_email AND session = ?) UNION (SELECT user_email FROM club_member WHERE club_id = ? AND receive_event_updates = true)";
                connection.query(
                  notify,
                  [
                    req.body.id,
                    req.session.id,
                    req.body.id
                  ],
                  function (err5, r, fields4) {
                    connection.release();
                    if (err5) {
                      console.log(err5);
                      res.sendStatus(500);
                      return;
                    }

                    if (r.length <= 1) {
                      res.sendStatus(500);
                      return;
                    }

                    for (let i = 2; i < r.length; i++) {
                      send_emails.push(r[i].name);
                    }

                    sendEmail("<No-Reply>", send_emails, "New Event (" + r[0].name + ")", r[1].name + " made a new event titled " + req.body.event_title + " in " + r[0].name + ".", r[0].name);
                  }
                );
                res.redirect('/clubs/' + req.params.id);
              }
            );
        }
      );
    });
  });
});

router.post('/:id/events/:eid/editted', function (req, res, next) {
  var send_emails = [];
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let eventInfoUpdateQuery = "UPDATE event SET title = ?, content = ?, location = ?, event_time = ? WHERE id = ?;";
    let phoneUpdateQuery = "UPDATE event_coordinator SET manager_phone = ? WHERE event_id = ?;";

    connection.query(
      eventInfoUpdateQuery,
      [
        req.body.title,
        req.body.content,
        req.body.location,
        req.body.time,
        req.body.eid
      ],
      function (error, results, fields) {
        if (error) {
          connection.release();
          console.log(error);
          res.sendStatus(500);
          return;
        }
        connection.query(
          phoneUpdateQuery,
          [req.body.phone, req.body.eid],
          function (error2, results2, fields2) {
            if (error2) {
              connection.release();
              console.log(error2);
              res.sendStatus(500);
              return;
            }
            var notify = "(SELECT name FROM club WHERE id = ?) UNION (SELECT username FROM user INNER JOIN user_session WHERE user.email = user_session.user_email AND session = ?) UNION (SELECT user_email FROM club_member WHERE club_id = ? AND receive_event_updates = true)";
            connection.query(
              notify,
              [
                req.body.id,
                req.session.id,
                req.body.id
              ],
              function (err3, r, fields1) {
                connection.release();
                if (err3) {
                  console.log(err3);
                  res.sendStatus(500);
                  return;
                }
                console.log(r);
                if (r.length <= 1) {
                  console.log("error here");
                  res.sendStatus(500);
                  return;
                }

                for (let i = 2; i < r.length; i++) {
                  send_emails.push(r[i].name);
                }

                sendEmail("<No-Reply>", send_emails, "Details changed (" + req.body.title + ")", r[1].name + " changed the details of event titled " + req.body.title + " in " + r[0].name + ".", r[0].name);
              }
            );
            res.redirect('/clubs/' + req.body.id);
          });
      });
  });
});

module.exports = router;
