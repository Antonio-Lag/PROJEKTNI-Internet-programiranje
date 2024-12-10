const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 3001;

// Parser za JSON podatke
app.use(bodyParser.json());

// Parser za podatke iz formi
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
host: 'ucka.veleri.hr',
user: 'edukic',
password: '11',
database: 'edukic'
});

app.use(express.urlencoded({ extended: true }));

connection.connect(function(err) {
if (err) throw err;
console.log("Connected!");
});

app.get("/api/knjige", (request, response) => {

connection.query("SELECT * FROM pzi_knjige", (error, results) => {
if (error) throw error;
console.log("Uspjeh za api Knjige!");
response.send(results);
});
});

app.get("/api/knjige/:id", (request, response) => {
const id = request.params.id;
connection.query("SELECT * FROM pzi_knjige WHERE id = ?", id, (error, results) => {
if (error) throw error;
response.send(results);
});
});

app.post("/api/rezerv_knjige", (request, response) => {
const data = request.body;
rezervacija = [[data.datum, data.id_knjiga, data.korisnik]]

connection.query("INSERT INTO pzi_rezervacija (datum_rezervacije, knjiga, korisnik) VALUES ?", [rezervacija], (error, results) => {
if (error) throw error;
response.send(results);
});
});

app.post("/api/unos_knjige", (request, response) => {
const data = request.body;
knjige = [[data.naslov, data.autor, data.god_izdanja, data.izdavac]]

connection.query("INSERT INTO pzi_knjige (naslov, autor, god_izdanja, izdavac) VALUES ?", [knjige], (error, results) => {
if (error) throw error;
response.send(results);
});
});


app.listen(3001, () => {
console.log("Server running at port: "+port);
});