var express = require('express');
var router = express.Router();
const path = require('path');
const argon2 = require('argon2');

// authenticate user
router.use('*', function (req, res, next) {
    // search session in database
    req.pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        var query = "SELECT COUNT(user_email) AS found FROM user INNER JOIN user_session WHERE user.email = user_session.user_email AND user.role = \"admin\" AND user_session.session = ?";
        connection.query(query, [req.session.id], function (err2, rows, fields) {
            connection.release();
            if (err2) {
                console.log(err2);
                res.sendStatus(500);
                return;
            }
            if (rows[0].found > 0) {
                next();
            } else {
                res.status(403);
                res.sendFile(path.resolve("private/invalid.html"));
                return;
            }
        });
    });
});

router.get('/', function (req, res, next) {
    res.sendFile(path.resolve("private/admin.html"));
});

router.get('/self.email', function (req, res, next) {
    // return users in database
    req.pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        var query = "SELECT user_email FROM user_session WHERE session = ?";
        connection.query(query, [req.session.id], function (err2, e, fields) {
            connection.release();
            if (err2) {
                console.log(err2);
                res.sendStatus(500);
                return;
            }
            res.status(200);
            res.json(e);
        });
    });
});

router.get('/users.json', function (req, res, next) {
    // return users in database
    req.pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        var query = "SELECT * FROM user INNER JOIN user_info WHERE user.email = user_info.user_email";
        connection.query(query, function (err2, rows, fields) {
            connection.release();
            if (err2) {
                console.log(err2);
                res.sendStatus(500);
                return;
            }
            res.status(200);
            res.json(rows);
        });
    });
});

router.get('/clubs.json', async function (req, res, next) {
    // return clubs in database
    req.pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        var query = "SELECT * FROM club";
        connection.query(query, function (err2, rows, fields) {
            if (err2) {
                console.log(err2);
                connection.release();
                res.sendStatus(500);
                return;
            }
            var clubs = rows;
            var managerPromises = clubs.map(function (club) {
                return new Promise(function (resolve, reject) {
                    var managerQuery = "SELECT user_email FROM club_member WHERE club_id = ? AND role = 'manager'";
                    connection.query(managerQuery, [club.id], function (err3, rows1, fields1) {
                        if (err3) {
                            console.log(err3);
                            reject(err3);
                        } else {
                            var updatedClub = { ...club };
                            updatedClub.managers = rows1.map(function (row) {
                                return row.user_email;
                            });
                            resolve(updatedClub);
                        }
                    });
                });
            });
            Promise.all(managerPromises)
                .then(function (updatedClubs) {
                    connection.release();
                    res.status(200);
                    res.json(updatedClubs);
                })
                .catch(function (error) {
                    console.log(error);
                    connection.release();
                    res.sendStatus(500);
                });
        });
    });
});


router.get('/pending.json', function (req, res, next) {
    req.pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        var query = "SELECT email, username, user.role, res.role, id, name, description, picture, category1, status FROM user INNER JOIN (SELECT * FROM club_member INNER JOIN (SELECT * FROM club WHERE club.status = \"pending\") clubs WHERE club_member.role = \"manager\" AND club_member.club_id = clubs.id) res WHERE user.email = res.user_email";
        connection.query(query, function (err2, rows, fields) {
            connection.release();
            if (err2) {
                console.log(err2);
                res.sendStatus(500);
                return;
            }
            res.status(200);
            res.json(rows);
        });
    });
});

router.post("/approve", function (req, res, next) {
    req.pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        var query = "UPDATE club SET status = \"active\" WHERE id = ?";
        connection.query(query, [req.body.club_id], function (err2, rows, fields) {
            connection.release();
            if (err2) {
                console.log(err2);
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
        });
    });
});

router.post("/close", function (req, res, next) {
    req.pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        var query = "UPDATE club SET status = \"closed\" WHERE id = ?";
        connection.query(query, [req.body.club_id], function (err2, rows, fields) {
            connection.release();
            if (err2) {
                console.log(err2);
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
        });
    });
});

router.post('/setadmin', function (req, res, next) {
    req.pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        var query = "UPDATE user SET role = \"admin\" WHERE email = ?";
        connection.query(query, [req.body.email], function (err2, rows, fields) {
            connection.release();
            if (err2) {
                console.log(err2);
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
        });
    });
});

router.post('/unsetadmin', function (req, res, next) {
    req.pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        var makerQuery = "SELECT user_email FROM user_session WHERE session = ?";
        connection.query(makerQuery, [req.session.id], function (err2, rows, fields) {
            connection.release();
            if (err2) {
                console.log(err2);
                res.sendStatus(500);
                return;
            }
            if (rows[0].user_email === req.body.email) {
                res.sendStatus(400);
            } else {
                var query = "UPDATE user SET role = \"user\" WHERE email = ?";
                connection.query(query, [req.body.email], function (err3, rows1, fields1) {
                    connection.release();
                    if (err3) {
                        console.log(err3);
                        res.sendStatus(500);
                        return;
                    }
                    res.sendStatus(200);
                });
            }
        });
    });
});

router.post('/edit/user', function (req, res, next) {
    req.pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        var user_query = "UPDATE user SET username = ? WHERE email = ?";
        connection.query(
            user_query,
            [req.body.username, req.body.email],
            function (err2, rows, fields) {
                connection.release();
                if (err2) {
                    console.log(err2);
                    res.sendStatus(500);
                    return;
                }
            }
        );

        var info_query = "UPDATE user_info SET firstname = ?, lastname = ?, contact = ?, biography = ?, profile_picture = ? WHERE user_email = ?";
        connection.query(
            info_query,
            [
                req.body.firstname,
                req.body.lastname,
                req.body.contact,
                req.body.biography,
                req.body.profile_picture,
                req.body.email
            ],

            function (err2, rows, fields) {
                connection.release();
                if (err2) {
                    console.log(err2);
                    res.sendStatus(500);
                    return;
                }
            }
        );
        res.sendStatus(200);
    });
});

router.post('/edit/club', async function (req, res, next) {
    req.pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        var query = "UPDATE club SET name = ?, description = ?, category1 = ?, picture = ? WHERE id = ?";
        connection.query(
            query,
            [
                req.body.name,
                req.body.description,
                req.body.category1,
                req.body.picture,
                req.body.id
            ],
            function (err2, rows, fields) {
                if (err2) {
                    console.log(err2);
                    connection.release();
                    res.sendStatus(500);
                    return;
                }

                var mcount = "SELECT COUNT(user_email) AS count FROM club_member WHERE club_id = ? AND role = 'manager'";
                connection.query(mcount, [req.body.id], function (err3, rows1, fields1) {
                    if (err3) {
                        console.log(err3);
                        connection.release();
                        res.sendStatus(500);
                        return;
                    }

                    if (req.body.rm_managers.length < rows1[0].count) {
                        console.log(req.body.rm_managers);
                        var rm = "UPDATE club_member SET role = 'member' WHERE club_id = ? AND user_email = ?";
                        var queries = req.body.rm_managers.map(function (manager) {
                            return new Promise(function (resolve, reject) {
                                connection.query(
                                    rm,
                                    [req.body.id,
                                        manager
                                    ],
                                    function (err4, rows2, fields2) {
                                        if (err4) {
                                            console.log(err4);
                                            reject(err4);
                                        } else {
                                            resolve();
                                        }
                                    }
                                );
                            });
                        });

                        Promise.all(queries)
                            .then(function () {
                                connection.release();
                                res.sendStatus(200);
                            })
                            .catch(function (error) {
                                console.log(error);
                                connection.release();
                                res.sendStatus(500);
                            });
                    } else {
                        connection.release();
                        res.sendStatus(200);
                    }
                });
            }
        );
    });
});

router.post('/edit/club/makemanager', function (req, res, next) {
    req.pool.getConnection(function (err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }

        let query = "SELECT role FROM club_member WHERE club_id = ? and user_email = (SELECT user_email FROM user_session WHERE session = ?)";
        connection.query(query, [req.body.id, req.session.id], function (error, member, field) {
            connection.release();
            if (error) {
                res.sendStatus(500);
                return;
            }

            if (member.length === 0) {
                let insert = "INSERT INTO club_member (user_email, club_id, role) VALUES ((SELECT user_email FROM user_session WHERE session = ?), ?, 'manager')";
                connection.query(
                    insert,
                    [
                        req.session.id,
                        req.body.id
                    ],
                    function (error1, set, field1) {
                        connection.release();
                        if (error) {
                            res.sendStatus(500);
                            return;
                        }
                        res.sendStatus(200);
                    }
                );
            } else if (member[0].role === "member") {
                let add = "UPDATE club_member SET role = 'manager' WHERE club_id = ? and user_email = (SELECT user_email FROM user_session WHERE session = ?)";
                connection.query(
                    add,
                    [
                        req.body.id,
                        req.session.id
                    ],
                    function (error1, set, field1) {
                        connection.release();
                        if (error) {
                            res.sendStatus(500);
                            return;
                        }
                        res.sendStatus(200);
                    }
                );
            } else {
                res.sendStatus(200);
            }
        });
    });
});

router.post('/signup', async function (req, res, next) {
    if ('username' in req.body && 'email' in req.body && 'password' in req.body) {
        req.pool.getConnection(async function (err, connection) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            let query = "INSERT INTO user (email, username, password, role) VALUES (?, ?, ?, 'admin')";
            const hash = await argon2.hash(req.body.password);

            connection.query(
                query,
                [req.body.email, req.body.username, hash],
                async function (error, results1, fields) {
                    connection.release();
                    if (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            res.sendStatus(409);
                        } else {
                            res.sendStatus(500);
                            return;
                        }
                    }
                    res.sendStatus(200);
                }
            );
        });
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;
