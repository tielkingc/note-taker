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

    fs.writeFile('./db/db.json', JSON.stringify(oldNotes), function (err) {
        if (err) {
            console.log(err);
        }
        console.log('Note saved')
    })
})

app.delete('/api/notes/:id', (req,res) => {
    // console.log(res)
    for (var i = 0; i < oldNotes.length; i++) {
        console.log(oldNotes[i].id)
        if (oldNotes[i].id === req.params.id) {
            oldNotes.splice(i, 1);
        }
    }

    fs.writeFile('./db/db.json', JSON.stringify(oldNotes), function (err) {
        if (err) {
            console.log(err);
        }
        console.log('Note deleted')
    })
})

app.listen(PORT, () => {
console.log(`App listening on PORT ${PORT}`);
});