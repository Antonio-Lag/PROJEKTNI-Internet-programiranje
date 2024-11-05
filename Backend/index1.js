// Kreirati lastite get, post i put, delete metode zaras s objektom unutar clatitog projekta 
//dva indexa jedan za filmove, jedan za serije, filmovi na jednom protu, serije na drugom portu

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/film', (request, response) => {
    return response.send('Popis filmova');
    });

app.post('/addMovie', (request, response) => {
    //Ocjena, godina, reziser, tip
    
    const data = request.body;
    const name = data.name;
    const year = data.year;
    const category = data.category;
    const producer = data.producer;

    console.log(data.name);
    console.log(data.year);
    console.log(data.category);
    console.log(data.producer);
    return response.send("Dodovanje filmova " +name+" "+year+" "+category+" "+producer+"" );
});
app.put('/updateMovie', (request, response) => {
   
    const data = request.body;
    const name = data.name;
    const year = data.year;
    const category = data.category;
    const producer = data.producer;

    console.log(data.name);
    console.log(data.year);
    console.log(data.category);
    console.log(data.producer);
    
    return response.send('Azuriranje filmova PUT metoda -> Change '+name+" "+year+" "+category+" "+producer+"");
    
});
app.delete('/deleteMovie', (request, response) => {
    return response.send('Brisanje filmova');
    const data = request.body;
    console.log('Delete '+data.kontakt);
    return response.send('Delete '+data.kontakt);
});


app.listen(1000, () => {
    console.log("Server running on port 1000");
    });