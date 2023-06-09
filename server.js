const express = require("express");
const db = require("./db/db.json");
const id = require("uuid");
const fs = require("fs");
const app = express();
const port = 3001;
app.listen(port);
console.log("listening at port " + port)
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "ejs")
app.get("/", (req, res) => {
  res.sendFile("index.html")
})
app.get("/notes", (req, res) => {
  //making usable information from the db.Json file
  let dbNotes = JSON.parse(fs.readFileSync("db/db.json"));
    res.render("notes.ejs", {noteList:dbNotes});
})
app.get(`/notes/:id`, (req, res) => {
  let dbNotes = JSON.parse(fs.readFileSync("db/db.json"));
 
  for(let i = 0; i<dbNotes.length; i++) {
    if(dbNotes[i].id == req.params.id) {
      res.render("notes", {title:dbNotes[i].title, text:dbNotes[i].text, noteList:dbNotes})
    }
  }
});

//delete
app.delete(`/notes/:id`, (req, res) => {
  
  let dbNotes = JSON.parse(fs.readFileSync("db/db.json"));
  for(let i = 0; i<dbNotes.length; i++) {
    if(dbNotes[i].id == req.params.id) {
      dbNotes.splice(i,1)
      fs.writeFileSync("db/db.json", JSON.stringify(dbNotes));
      dbNotes = JSON.parse(fs.readFileSync("db/db.json"));

      break;
    }
  }
  res.render("notes", {noteList:dbNotes})
})



//post
app.post("/notes", (req, res) => {
    let dbFile = JSON.parse(fs.readFileSync("db/db.json"));
    let newNote = req.body
    newNote.id = id.v1()
    dbFile.push(newNote);
    fs.writeFileSync("db/db.json", JSON.stringify(dbFile));
    let dbNotes = JSON.parse(fs.readFileSync("db/db.json")); 
    res.render("notes", {noteList:dbNotes});
})


 