const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/casopis', (request, response) => {
return response.send('Unosite podatke casopisa');
});
app.post('/addcasopis', (request, response) => {
    const data = request.body;
    const id=data.id;
    const naziv=sdata.naziv;
    const opis=data.sadrzaj;

    console.log(data.id);
    console.log(data.naziv);
    console.log(data.opis);
    return response.send("Dodavanje Casopisa " +id+ " " +naziv+ " " +opis+ " ");
});

app.put('/updatecasopis', (request, response) => {

    const data = request.body;
    const id=data.id;
    const naziv=sdata.naziv;
    const opis=data.sadrzaj;

    console.log(data.id);
    console.log(data.naziv);
    console.log(data.opis);
    return response.send("Azuriranje Casopisa " +id+ " " +naziv+ " " +opis+ " ");

});
app.delete('/deletecasopis', (request, response) => {
    const data = request.body;
    console.log('Delete '+data.id);
    return response.send('Delete '+data.id);
});
app.listen(3000, () => {
console.log("Server  on port 3000");
});