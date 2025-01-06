const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const { register } = require("module");

const app = express();
const port = 3001;

app.use(bodyParser.json());

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


  app.use(express.static(path.join(__dirname, "..",  "frontend")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "")); 
});
  
app.get("/api/movie", (request, response) => {
    
    connection.query("SELECT * FROM Movies", (error, results) => {
      if (error) throw error;
      response.send(results);
    });
});

app.get("/api/movie/:id", (request, response) => {
    const id = request.params.id;
    connection.query("SELECT * FROM Movies WHERE id = ?", id, (error, results) => { 
        if (error) throw error;
        response.send(results);
      });
});

app.post("/api/reser", (request, response) => {
    const data = request.body;
    rezervacija = [[data.date, data.id_movie, data.user]]

    connection.query("INSERT INTO Reservation (date_reservation, movie_id, username) VALUES ?", [rezervacija], (error, results) => {
      if (error) throw error;
      response.send(results);
    });
  });

  app.post("/api/insert_movie", (request, response) => {
    const data = request.body;
    newmovie = [[data.movie, data.producer, data.year, data.category, data.image, data.video, data.description]]

    connection.query("INSERT INTO Movies (name_mov, producer, year_mov, category, image, video_id, description) VALUES ?", [newmovie], (error, results) => {
      if (error) throw error;
      response.send(results);
    });
  });

  app.post("/api/register", (request,response)=> {
    const data=request.body;
    registration=[[data.name, data.surname, data.username, data.password]]

    connection.query("SELECT * FROM Users WHERE username = ?", [data.username], (error, results) => {
      if (error) throw error;

      if (results.length>0){
        return response.status(400).json({message:'An account with that username already exists'});
      }




    
    connection.query("INSERT INTO Users (name_sr, last_name, username, password) VALUES ?", [registration], (error, results) => {
    if (error) throw error;
    response.send(results);
    });
  });
});


  app.listen(3001, () => {
    console.log("Server running on port 3001");
    });
