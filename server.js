const express = require('express');
const oldNotes = require('./db/db.json');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/db'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    return res.json(oldNotes);
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    oldNotes.push(newNote);
    
    console.log(oldNotes);

    fs.writeFile('./db/db.json', JSON.stringify(oldNotes), function (err) {
        if (err) {
            console.log(err);
        }
        console.log('Note saved')
    })
})

app.listen(PORT, () => {
console.log(`App listening on PORT ${PORT}`);
});