const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const { request } = require("http");

const app = express();
const port = 3001;

// Parser for JSON data
app.use(bodyParser.json());

// Parser for form data
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'ucka.veleri.hr',
    user: 'alagundzija',
    password: '11',
    database: 'alagundzija'
});

app.use(express.urlencoded({ extended: true }));

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "")); // Serve the HTML file
});

// Endpoint to fetch movies
app.get("/api/movie", (request, response) => {
    connection.query("SELECT * FROM Movies", (error, results) => {
        if (error) throw error;
        response.send(results);
    });
});

// Endpoint to fetch a specific movie by ID
app.get("/api/movie/:id", (request, response) => {
    const id = request.params.id;
    connection.query("SELECT * FROM Movies WHERE id = ?", id, (error, results) => {
        if (error) throw error;
        response.send(results);
    });
});

// Endpoint to fetch series
app.get("/api/series", (request, response) => {
    connection.query("SELECT * FROM Series", (error, results) => { // Assuming you have a Series table
        if (error) throw error;
        response.send(results);
    });
});

app.get("/api/series/:id", (request, response) => {
  const id = request.params.id;
  connection.query("SELECT * FROM Series WHERE id = ?", id, (error, results) => {
      if (error) throw error;
      response.send(results);
  });
});

// Endpoint to insert a reservation
app.post("/api/reser", (request, response) => {
    const data = request.body;
    const rezervacija = [[data.date, data.id_movie, data.user]];

    connection.query("INSERT INTO Reservation (date_reservation, movie_id, username) VALUES ?", [rezervacija], (error, results) => {
        if (error) throw error;
        response.send(results);
    });
});

// Endpoint to insert a new movie
app.post("/api/insert_movie", (request, response) => {
    const data = request.body;
    const newmovie = [[data.movie, data.producer, data.godina, data.category]];

    connection.query("INSERT INTO Movies (name_mov, producer, year_mov, category) VALUES ?", [newmovie], (error, results) => {
        if (error) throw error;
        response.send(results);
    });
});

// Endpoint to register a new user
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

app.get("/api/checkout", (request,response)=> {
    connection.query("SELECT * FROM checkout", (error, results) => { // Assuming you have a Series table
        if (error) throw error;
        response.send(results);
    });
});

app.post("/api/insert_checkout", (request, response) => {
    const data=request.body;
    const checkout=[[data.id]];

    connection.query("INSERT INTO Checkout (id) VALUES ?", [checkout], (error, results) => {
        if (error) throw error;
        response.send(results);
    });
});

app.post("/api/user_checkout", (request, response) => {
    const data=request.body;
    const checkout=[[data.username]];

    connection.query("INSERT INTO Checkout (username) VALUES ?", [checkout], (error, results) => {
        if (error) throw error;
        response.send(results);
    });
});

app.delete("/api/delete_checkout")


app.delete("/api/empty_checkout", (request,response)=> {
    connection.query("DELETE FROM checkout", (error, results) => { // Assuming you have a Series table
        if (error) throw error;
        response.send(results);
    });
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});