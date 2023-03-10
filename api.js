const express = require('express');
const bodyparser = require('body-parser');
const Pool = require('pg').Pool;
const password_hash = require('password-hash');
const { json } = require('express');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'root',
    port: '5432',
});

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        'API v.': 0.1,
        'request_method': "GET",
        "message": "Hello dear user! This application is my First node.js RestAPI =)"
    }))
})

app.post('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        'API v.': 0.1,
        'request_method': "POST",
        "message": "Hello dear user! This application is my First node.js RestAPI =)"
    }));
})

app.get('/create_user', (req, res) => {
    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify({
        'message': "Please use method POST and send username, email, password, confirm_password"
    }))
})


app.post('/create_user', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let confirm_password = req.body.confirm_password;
    if (username.length < 4 || email.length < 4 || password.length < 8 || confirm_password.length < 8) {
        res.end(JSON.stringify({
            "accoutn_creating": "faild",
            "message": "Invalid data"
        }));
    } else if (password != confirm_password) {
        res.end(JSON.stringify({
            "account_creating ": "faild",
            "message": "password and confirm_password must be identical"
        }));
    } else {
        password = password_hash.generate(password);
        let id = Math.random().toString(16).slice(2);
        pool.query("INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *", [id, username, email, password], (error, results) => {
            if (error) {
                throw error;
            }
            res.end(JSON.stringify({
                "account_creating": "success",
                "message": `login: ${id}, password: ${confirm_password}`
            }));
        });
    }

});

app.post('/create_task', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let login = req.body.login;
    let password = req.body.password;
    let task_name = req.body.task_name;
    let task_text = req.body.task_text;
    let is_login = false
    pool.query("SELECT password FROM users WHERE id = $1", [login], (error, results) => {
        if (password_hash.verify(password, results.rows[0]['password']) == true) {
            is_login = true;
            console.log(is_login);
            if (is_login == true){
                pool.query("INSERT INTO tasks (user_id, task_name, task_text) VALUES ($1, $2, $3) RETURNING *", [login, task_name, task_text], (error, results) => {
                    if (error){
                        throw error;
                    } 
                    res.end(JSON.stringify({
                        "message" : `task "${task_name}" created`
                    }));
                });
            }
        } else {
            res.end(JSON.stringify({ "message-error": "incorrect password" }));
        }
    })
    
});

app.get('/show_tasks', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let login = req.query.login;
    let password = req.query.password;
    pool.query("SELECT password FROM users WHERE id = $1", [login], (error, results) => {
        if (password_hash.verify(password, results.rows[0]['password']) == true) {
            pool.query("SELECT task_name, task_text FROM tasks WHERE user_id = $1", [login], (error, results) => {
                res.status(200).json(results.rows);
            })
        } else {
            res.end(JSON.stringify({ "message-error": "incorrect password" }));
        }
    })
})

app.listen(port, () => {
    console.log(`Application listening on port ${port}`);
});