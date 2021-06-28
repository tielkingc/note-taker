const express = require('express');
const oldNotes = require('./db/db.json');
const fs = require('fs');
const path = require('path');
const Ids = require('ids');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/db'));

function writeToFile(data) {
    fs.writeFile('./db/db.json', JSON.stringify(data), err => {
        if (err) {
          console.error(err)
          return;
        }
    })
}

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
    const ids = new Ids();
    let noteId = ids.next();

    while (!ids.assigned(noteId)){
        noteId = ids.next();
    }

    newNote.id = noteId;

    oldNotes.push(newNote);
    
    console.log(oldNotes);

    writeToFile(oldNotes);
    document.location.reload(true)
})

app.delete('/api/notes/:id', (req,res) => {
    for (var i = 0; i < oldNotes.length; i++) {
        if (oldNotes[i].id === req.params.id) {
            oldNotes.splice(i, 1);
        }
    }

    writeToFile(oldNotes);
    document.location.reload(true)
})

app.listen(PORT, () => {
console.log(`App listening on PORT ${PORT}`);
});