const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'ucka.veleri.hr',
    user: 'alagundzija',
    password: '11',
    database: 'alagundzija'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "Register.html")); 
});

// Movies API
app.get("/api/movie", (request, response) => {
    const category = request.query.category;
    let query = "SELECT * FROM Movies";
    const queryParams = [];

    if (category) {
        query += " WHERE category = ?";
        queryParams.push(category);
    }

    connection.query(query, queryParams, (error, results) => {
        if (error) throw error;
        response.send(results);
    });
});

app.get("/api/categories", (request, response) => {
    connection.query("SELECT DISTINCT category FROM Movies ORDER BY category ASC", (error, results) => {
        if (error) throw error;
        const categories = results.map(row => row.category);
        response.send(categories);
    });
});

app.get("/api/movie/:id", (request, response) => {
    const id = request.params.id;
    connection.query("SELECT * FROM Movies WHERE id = ?", id, (error, results) => {
        if (error) throw error;
        response.send(results);
    });
});

// Series API
app.get("/api/series", (request, response) => {
    const category = request.query.category;
    let query = "SELECT * FROM Series";
    const queryParams = [];

    if (category) {
        query += " WHERE category = ?";
        queryParams.push(category);
    }

    connection.query(query, queryParams, (error, results) => {
        if (error) throw error;
        response.send(results);
    });
});

app.get("/api/categoriess", (request, response) => {
    connection.query("SELECT DISTINCT category FROM Series ORDER BY category ASC", (error, results) => {
        if (error) throw error;
        const categories = results.map(row => row.category);
        response.send(categories);
    });
});

app.get("/api/series/:id", (request, response) => {
    const id = request.params.id;
    connection.query("SELECT * FROM Series WHERE id = ?", id, (error, results) => {
        if (error) throw error;
        response.send(results);
    });
});

// Users API
app.get("/api/users", (request, response) => {
    connection.query("SELECT * FROM Users", (error, results) => { 
        if (error) throw error;
        response.send(results);
    });
});

app.delete("/api/delete_user/:id", (request, response) => {
    const userId = request.params.id;
    connection.query("DELETE FROM Users WHERE user_id = ?", [userId], (error, results) => {
        if (error) throw error;
        if (results.affectedRows === 0) {    
            return response.status(404).send({ message: "User  not found" });
        }    
        response.send({ message: "User  deleted successfully" });    
    });
});

// Insert Movies and Series
app.post("/api/insert_movie", (request, response) => {
    const data = request.body;
    const newmovie = [[data.movie, data.producer, data.year_mov, data.category, data.image, data.video_id, data.description_mov, data.price]];

    connection.query("INSERT INTO Movies (movie, producer, year_mov, category, image, video_id, description_mov, price) VALUES ?", [newmovie], (error, results) => {
        if (error) throw error;
        response.send(results);
    });
});

app.post("/api/insert_series", (request, response) => {
    const data = request.body;
    const newseries = [[data.serie, data.producer, data.year_mov, data.category, data.image, data.video_id, data.description, data.price]];

    connection.query("INSERT INTO Series (serie, producer, year_mov, category, image, video_id, description, price) VALUES ?", [newseries], (error, results) => {
        if (error) throw error;
        response.send(results);
    });
});

// User Registration and Login
app.post("/api/register", (request, response) => {
    const data = request.body;
    const registration = [[data.name, data.surname, data.username, data.password]];

    connection.query("SELECT * FROM Users WHERE username = ?", [data.username], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            return response.status(400).json({ message: 'An account with that username already exists' });
        }

        connection.query("INSERT INTO Users (name_sr, last_name, username, password) VALUES ?", [registration], (error, results) => {
            if (error) throw error;
            response.send(results);
        });
    });
});

app.post("/api/login", (request, response) => {
    const data = request.body;
    
    connection.query("SELECT * FROM Users WHERE username = ? AND password = ?", [data.username, data.password], (error, results) => {
        if (error) throw error;

        if (results.length == 0) {
            return response.status(400).json({ message: 'An account with that username does not exist' });
        }
        return response.status(200).json({ message: 'Login successful', data: { username: data.username } });
    });
});

// Checkout API
app.get("/api/checkout", (request, response) => {
    connection.query("SELECT * FROM Checkout", (error, results) => { 
        if (error) throw error;
        response.send(results);
    });
});

app.post("/api/insert_checkout", (request, response) => {
    const data = request.body; 
    const checkoutId = data.id;
    const isSeries = data.isSeries; 
    const title = data.title; 
    const price = data.price; 

    if (checkoutId == null) {
        return response.status(400).send({ message: 'Invalid ID provided' });
    }

    let query;
    let values;

    if (isSeries) {
        query = "INSERT INTO Checkout (id_series, title, price) VALUES (?, ?, ?)";
        values = [checkoutId, title, price];
    } else {
        query = "INSERT INTO Checkout (id_movies, title, price) VALUES (?, ?, ?)";
        values = [checkoutId, title, price];
    }

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error inserting into checkout:', error);
            return response.status(500).send('Error inserting into checkout');
        }
        response.send(results);
    });
});

// Delete from Checkout
app.delete("/api/delete_checkout", (request, response) => {
    const { id_movies, id_series } = request.body; 

    if (!id_movies && !id_series) {
        return response.status(400).send({ message: 'Invalid ID provided' });
    }

    let query;
    let values;

    if (id_series) {
        query = "DELETE FROM Checkout WHERE id_series = ?";
        values = [id_series];
    } else {
        query = "DELETE FROM Checkout WHERE id_movies = ?";
        values = [id_movies];
    }

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error deleting from checkout:', error);
            return response.status(500).send('Error deleting from checkout');
        }
        response.send(results);
    });
});

// Empty Checkout
app.delete("/api/empty_checkout", (request, response) => {
    connection.query("DELETE FROM Checkout", (error, results) => { 
        if (error) throw error;
        response.send(results);
    });
});

app.listen(3001, () => {
    console.log(`Server running on port 3001`);
});