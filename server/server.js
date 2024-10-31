const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    key: 'userId',
    secret: 'egzaminas',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 1000 * 60 * 60
    }
}))

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'eventapp'
})

app.post('/register', async (req, res) => {

    const data = {
        username: req.body.username,
        password: req.body.password
    }

    const hashedpassword = await bcrypt.hash(data.password, 10)

    data.password = hashedpassword;

    db.query("SELECT * FROM vartotojai WHERE username = ?", [data.username], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Klaida" });
        }
        if (result.length > 0 ) {
            return res.status(400).json({ error: "Toks vartotojo vardas jau egzistuoja" });
            
        } else {
            db.query("INSERT INTO vartotojai (username, password) VALUES (?,?)", [data.username, data.password], (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: "Klaida" });
                } else {
                    res.status(200).json({ message: "Registracija sėkminga" });
                }
            })
        }
    })
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        res.send({LoggedIn: true, user: req.session.user})
    } else {
        res.send({LoggedIn: false})
    }
})

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query("SELECT * FROM vartotojai WHERE username = ?", [username], async (err, result) => {
        
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Klaida" });
        }
   
            if (result.length > 0) {
            const hash = result[0].password
            const checkedpassword = await bcrypt.compare(password, hash)
            if (checkedpassword) {
              req.session.user = result;
              console.log(req.session.user)
              res.status(200).json({ message: 'Prisijungimas sėkmingas', result });  
            } else {
                res.status(401).json({ message: "Blogas prisijungimo vardas arba slaptažodis" });
            }
            
            } else {
            res.status(401).json({ message: "Blogas prisijungimo vardas arba slaptažodis" });
            console.log(result);
            }      
        
    })
})

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "nepavyko atsijungti" });
        } else {
            res.clearCookie('userId');
            res.status(200).json({ message: "Sėkmingai atsijungėte" });
        }       
    });
})

app.get('/authors', (req, res) => {
    db.query('SELECT * FROM vartotojai', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Klaida" });
        }
        if (result.length > 0) {
            res.send({result})
        }
    })
});

app.get('/verifiedposts', (req, res) => {
    db.query('SELECT * FROM renginiai WHERE verified = 1', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Klaida" });
        }
        if (result.length > 0) {
            res.send({result})
        }
    });
});

app.get('/posts', (req, res) => {
    db.query('SELECT * FROM renginiai WHERE verified = 0', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Klaida" });
        }
        if (result.length > 0) {
            res.send({result})
        }
    });
})

app.post('/posts', (req, res) => {
    const data = {
        author: req.body.author,
        title: req.body.title,
        category: req.body.category,
        time: req.body.time,
        place: req.body.place,
        image: req.body.image,
        description: req.body.description
    }


    db.query("INSERT INTO renginiai (author, title, category, time, place, image, description) VALUES (?, ?, ?, ?, ?, ?, ?)", [data.author, data.title, data.category, data.time, data.place, data.image, data.description], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Klaida" });
        } else {
            console.log(result)
            res.status(200).json({ message: 'Sėkmingai pateikėte renginį' }); 
        }
    })
})

app.post('/profilepic', (req, res) => {
    const picture = req.body.picture;
    const username = req.body.username;

    db.query("UPDATE vartotojai SET profilepicture = ? WHERE username = ?", [picture, username], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Klaida" });
        } else {
            
            console.log(req.session.user)
            db.query("SELECT * FROM vartotojai WHERE username = ?", [username], (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: "Klaida" });
                } else {
                    req.session.user = results;
                    res.status(200).json({ message: "sekmingai pakeitete nuotrauka", profileimg: results });
                }
            })
        }
    });


});

app.get('/profileposts', (req, res) => {
    const username = req.session.user[0].username;
    db.query('SELECT * FROM renginiai WHERE author = ?', username, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Klaida" });
        } 

        if (result) {
            res.send({result})
        } 
    })
});

app.post('/profileposts', (req, res) => {
    const data = {
        postid: req.body.postid,
        title: req.body.title,
        category: req.body.category,
        time: req.body.time,
        place: req.body.place,
        image: req.body.image,
        description: req.body.description
    }

    db.query('UPDATE renginiai SET title = ?, category = ?, time = ?, place = ?, image = ?, description = ? WHERE eventid = ?', [data.title, data.category, data.time, data.place, data.image, data.description, data.postid], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Klaida" });
        } else {
            console.log(result)
            res.status(200).json({ message: 'Sėkmingai pakeitėte turinį' }); 
        }
    })
})

app.post('/deletepost', (req, res) => {
    const postid = req.body.postid;

    db.query('DELETE FROM renginiai WHERE eventid = ?', postid, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({error: "Klaida!"});
        } else {
            console.log(result)
            res.status(200).json({message: 'Sėkmingai pašalinote tema'});
        }
    })
})

app.post('/admincategory', (req, res) => {
    const postid = req.body.postid;
    const category = req.body.category;

    db.query('UPDATE renginiai SET category = ? WHERE eventid = ?', [category, postid], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({message: "Klaida!"});
        } else {
            res.status(200).json({ message: 'Sėkmingai pakeitėte turinį' }); 
        }
    })
})

app.post('/adminverify', (req, res) => {
    const postid = req.body.postid;

    db.query('UPDATE renginiai set verified = 1 WHERE eventid = ?', postid, (err, result) => {
        if (err) {
            res.status(500).json({error: 'Klaida!'});
        } else {
            res.status(200).json({message: 'Renginys patvirtintas'});
        }
    })
})

app.post('/adminunverify', (req, res) => {
    const postid = req.body.postid;

    db.query('UPDATE renginiai set verified = 0 WHERE eventid = ?', postid, (err, result) => {
        if (err) {
            res.status(500).json({error: 'Klaida!'});
        } else {
            res.status(200).json({message: 'Renginys patvirtintas'});
        }
    })
})

app.post('/adminban', (req, res) => {
    const author = req.body.author;

    db.query('UPDATE vartotojai set banned = 1 WHERE username = ?', author, (err, result) => {
        if (err) {
            res.status(500).json({error: 'Klaida!'});
        } else {
            res.status(200).json({message: 'Vartotojas užblokuotas'});
        }
    })
})

app.post('/adminunban', (req, res) => {
    const author = req.body.author;

    db.query('UPDATE vartotojai set banned = 0 WHERE username = ?', author, (err, result) => {
        if (err) {
            res.status(500).json({error: 'Klaida!'});
        } else {
            res.status(200).json({message: 'Vartotojas užblokuotas'});
        }
    })
})

app.listen(3000, () => {
    console.log('mysql connected')
})