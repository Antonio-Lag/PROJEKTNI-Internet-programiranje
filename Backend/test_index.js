    const express = require("express");
    const cors = require("cors");
    const bodyParser = require("body-parser");
    const mysql = require("mysql");
    const path = require("path");
    const { request } = require("http");

    const app = express();


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

    app.use(express.static(path.join(__dirname, "..", "frontend")));

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "frontend", "Register.html")); 
    });

    // Fetch all movies with optional category filtering

    app.get("/api/movie", (request, response) => {

        const category = request.query.category; // Get the category from query parameters

        let query = "SELECT * FROM Movies";

        let queryParams = [];


        if (category) {

            query += " WHERE category = ?";

            queryParams.push(category);

        }


        connection.query(query, queryParams, (error, results) => {

            if (error) throw error;

            response.send(results);

        });

    });


    // Fetch all categories (assuming you have a categories table)

    app.get("/api/categories", (request, response) => {

        connection.query("SELECT DISTINCT category FROM Movies  ORDER BY category ASC", (error, results) => {

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

    // Fetch all movies with optional category filtering

    app.get("/api/series", (request, response) => {

        const category = request.query.category; // Get the category from query parameters

        let query = "SELECT * FROM Series";

        let queryParams = [];


        if (category) {

            query += " WHERE category = ?";

            queryParams.push(category);

        }


        connection.query(query, queryParams, (error, results) => {

            if (error) throw error;

            response.send(results);

        });

    });


    // Fetch all categories (assuming you have a categories table)

    app.get("/api/categoriess", (request, response) => {

        connection.query("SELECT DISTINCT category FROM Series ORDER BY category ASC", (error, results) => {

            if (error) throw error;

            const categories = results.map(row => row.category);

            response.send(categories);

        });

    });

    // app.get("/api/series", (request, response) => {
    //    connection.query("SELECT * FROM Series", (error, results) => { 
    //        if (error) throw error;
    //        response.send(results);
    //    });
    //});

    app.get("/api/series/:id", (request, response) => {
    const id = request.params.id;
    connection.query("SELECT * FROM Series WHERE id = ?", id, (error, results) => {
        if (error) throw error;
        response.send(results);
    });
    });

    //select * from movies where category = ?, [search]
    // to napraviti kao padjući meni


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
     
    app.post("/api/insert_movie", (request, response) => {
        const data = request.body;
        const newmovie = [[data.movie, data.producer, data.year_mov, data.category, data.image, data.video_id, data.description_mov]];

        connection.query("INSERT INTO Movies (movie, producer, year_mov, category, image, video_id, description_mov, price) VALUES ?", [newmovie], (error, results) => {
            if (error) throw error;
            response.send(results);
        });
    });

    app.post("/api/insert_series", (request, response) => {
        const data = request.body;
        const newmovie = [[data.serie, data.producer, data.year_mov, data.category, data.image, data.video_id, data.description]];

        connection.query("INSERT INTO Series (serie, producer, year_mov, category, image, video_id, description, price) VALUES ?", [newmovie], (error, results) => {
            if (error) throw error;
            response.send(results);
        });
    });

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
        
            connection.query("SELECT * FROM Users WHERE username = ? AND password = ?", [data.username,data.password], (error, results) => {
            if (error) throw error;
    
            if (results.length == 0) {
                return response.status(400).json({ message: 'An account with that username does not exist' });
            }
            return response.status(200).json({ message: 'Login successful', data: { username: data.username } });
           
        });
    });

    app.get("/api/checkout", (request,response)=> {
        connection.query("SELECT * FROM Checkout", (error, results) => { 
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
        connection.query("DELETE FROM Checkout", (error, results) => { 
            if (error) throw error;
            response.send(results);
        });
    });



    app.listen(3001, () => {
        console.log(`Server running on port 3001`);
    });