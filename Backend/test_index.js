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
    const newmovie = [[data.movie, data.producer, data.year, data.category, data.image, data.video_id, data.description]];

    connection.query("INSERT INTO Movies (movie, producer, year_mov, category, image, video_id, description) VALUES ?", [newmovie], (error, results) => {
        console.log('Received movie data:', request.body);
        if (error) {
          console.error('Error during insertion:', error); // Add this line for detailed error logging
          response.status(500).send('Error inserting movie'); // Send a response indicating an error
          return; // Exit the function to prevent further execution
      }
        //if (error) throw error;
        console.log('Insertion results:', results); // Add this line
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
    connection.query("SELECT * FROM Checkout", (error, results) => { // Assuming you have a Series table
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
    connection.query("DELETE FROM Checkout", (error, results) => { // Assuming you have a Series table
        if (error) throw error;
        response.send(results);
    });
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});