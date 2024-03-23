const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { dirname } = require('path');
const path = require('path');


const app = express();
const port =3091;
app.use(express.static('css'));
console.log(__dirname);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1js21is021@123',
    database: 'project',
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to MySQL');
    }
});
// Serve HTML file
app.get('/', (req, res) => {
    console.log("dirname",__dirname);
    res.sendFile(__dirname+ '/index.html');
});

app.get('/p', (req, res) => {
    console.log("hello");
    res.sendFile(__dirname+'/project4.html');
});

app.get('/login', (req, res) => {
    console.log("hello");
    res.sendFile(__dirname+'/project.html');
});
app.get('/newaccount', (req, res) => {
    console.log("hello");
    res.sendFile(__dirname+'/project1.html');
});
app.get('/s', (req, res) => {
    console.log("hello");
    res.sendFile(__dirname+'/new.html');
});
app.get('/re', (req, res) => {
    console.log("hello");
    res.sendFile(__dirname+'/re.html');
});

app.get('/api/items', (req, res) => {
    const getItemsQuery = 'SELECT * FROM pet';
    db.query(getItemsQuery, (err, results) => {
        if (err) {
            console.error('Error fetching items:', err);
            res.status(500).json({ error: 'Error fetching items' });
        } else {
            res.json(results);
        }
    });
});

// Handle form submission
app.post('/submitForm', (req, res) => {
    const { name, age, email, pass, phn } = req.body;

    const insertUserQuery = 'INSERT INTO users (name, age, email, password, phone) VALUES (?, ?, ?, ?, ?)';
    db.query(insertUserQuery, [name, age, email, pass, phn], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).json({ error: 'Error inserting user' });
        } else {
           // res.status(200).json({ message: 'User inserted successfully' });
            res.sendFile(__dirname+'/project.html');
        }
    });

});

app.post('/adr', (req, res) => {
    const {animal,cust,country} = req.body;

    const insertUserQuery = 'INSERT INTO pet(breed_name,customer_id,origin_country) VALUES (?, ?,?)';
    db.query(insertUserQuery, [animal,cust,country], (err, result) => {
        if (err) {
            
            console.error('Error inserting user:', err);
            res.status(500).json({ error: 'Error inserting user' });
        } else {
           // res.status(200).json({ message: 'User inserted successfully' });
            res.sendFile(__dirname+'/new.html');
            
        }
    });
});
app.post('/api/interested', (req, res) => {
    const { breed_id, customer_id } = req.body;
    const insertUserQuery = 'INSERT INTO bcid(breed_id, customer_id) VALUES (?, ?)';
    const deletePetQuery = 'DELETE FROM pet USING pet JOIN bcid ON pet.breed_id = bcid.breed_id WHERE bcid.customer_id = ?';

    // Insert data into bcid table
    db.query(insertUserQuery, [breed_id, customer_id], (insertErr, insertResult) => {
        if (insertErr) {
            console.error('Error inserting user:', insertErr);
            res.status(500).json({ error: 'Error inserting user' });
        } else {
            // Delete data from the pet table based on the join condition
            db.query(deletePetQuery, [customer_id], (deleteErr, deleteResult) => {
                if (deleteErr) {
                    console.error('Error deleting pet data:', deleteErr);
                    res.status(500).json({ error: 'Error deleting pet data' });
                } else {
                    console.log('Delete result:', deleteResult);
                    res.status(200).json({ message: 'User inserted and pet data deleted successfully' });
                    
                }
            });
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const checkUserQuery = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(checkUserQuery, [email, password], (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.length > 0) {
                // Redirect to profile page or show success message
                res.sendFile(__dirname+'/index.html');
            } else {
                res.send('Invalid credentials. Please try again.');
            }
        }
    });
});
// ... (Existing code)

// API endpoint to get all data
app.get('/api/getData', (req, res) => {
    const getDataQuery = 'SELECT * FROM pet';
    db.query(getDataQuery, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            res.json(results);
        }
    });
});

// ... (Existing code)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });


