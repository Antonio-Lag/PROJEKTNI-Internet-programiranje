// Kreirati lastite get, post i put, delete metode zaras s objektom unutar clatitog projekta 
//dva indexa jedan za filmove, jedan za serije, filmovi na jednom protu, serije na drugom portu

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let movies = [
    {
        "id": 1,
        "name": "Lord of the Rings",
        "producer": "J.R.R. Tolkien",
        "year": "1954",
        "category": "Fantasy"
    },
    {
        "id": 2,
        "name": "Dune",
        "producer": "Villeneuve",
        "year": "2021",
        "category": "Sci-Fi"
    },
]



app.get('/getmovie/:id', (request, response) => {
        let id = request.params.id;
        let movie = "";



        movies.forEach(element => {
            if(element.id ==id){
                movie= JSON.stringify(element);
            }            
        });



        return response.send('Getting Movie '+movie);
        });

        
app.post('/addMovie', (request, response) => {
    //Ocjena, godina, reziser, tip
    
    const data = request.body;
    const name = data.name;
    const year = data.year;
    const category = data.category;
    const producer = data.producer;

    let movie={
        "id": movies.length+1,
        "name": name,
        "producer": producer,
        "year": year,
        "category": category

    };
    movies.push(movie);



   
    return response.send('Adding movie. New list:' + JSON.stringify(movies));
        //' +id+' '+name+" "+year+" "+category+" "+producer);
});
app.put('/updateMovie/:id', (request, response) => {
    let id = request.params.id;

    const data = request.body;
    const name = data.name;
    const year = data.year;
    const category = data.category;
    const producer = data.producer;

    
    return response.send('Updating movie with id:' +id+' Name:'+name+" Year:"+year+" Category:"+category+" Producer:"+producer);
    
});

app.put('/updateMovie:id', (request, response) => {

   
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


app.delete('/deletemovie', (request, response) => {


    return response.send('Deleting moive');
});

app.delete('/deletemovie/:id', (request, response) => {
        let id = request.params.id;
        
        let movie = "";



        movies.forEach(element => {
            if(element.id ==id){
                movies.pop(element); //nije dobro riješenje, pravo riješenje nepoznato
            }            
        });

        return response.send('Deleting Movie with ID: '+id+ "New movie list" + JSON.stringify(movies));
        });

app.listen(1000, () => {
    console.log("Server running on port 1000");
    });