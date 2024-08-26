import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios"
import { title } from "process";
import { isBigInt64Array } from "util/types";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Connecting database - postgreSQL
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "library",
  password: "Active_2005",
  port: 5432,
});
db.connect();

// Render main page
app.get("/", async (req, res) => {
    try {
      const response = await db.query("SELECT * FROM books ORDER BY id ASC");
      res.render("index.ejs", { books: response.rows});
    } catch (error) {
      res.status(500).json({ message: "Error fetching posts" });
    }
});

// Render specific book page
app.get('/book/:id', async (req, res) => {
    const id = req.params.id
    try {
        const response_book = await db.query("SELECT * FROM books WHERE id = $1", [id])
        const response_notes = await db.query("SELECT * FROM notes WHERE book_id = $1 ORDER BY id ASC", [id])
        res.render("view.ejs", { book: response_book.rows[0], notes: response_notes.rows} )
    } catch (error) {
        console.log(error)
    }
});

// Render specific book edit page
app.get('/edit/:id', async (req, res) => {
  const id = req.params.id
  try {
      const response_book = await db.query("SELECT * FROM books WHERE id = $1", [id])
      const response_notes = await db.query("SELECT * FROM notes WHERE book_id = $1 ORDER BY id ASC", [id])
      res.render("edit.ejs", { book: response_book.rows[0], notes: response_notes.rows} )
  } catch (error) {
      console.log(error)
  }
});


// Update or delete a note and redirect to its page
app.post('/edit/:id/update', async (req, res) => {
  const updated_notes = req.body.updatedNotes;
  const notes_id = req.body.updatedNotesId
  const book_id = req.body.bookId
  const btnValue = req.body["update-btn"]
  try {
    if (btnValue === "update"){
      await db.query("UPDATE notes SET note = ($1) WHERE id = $2", [updated_notes, notes_id])
    } else {
      await db.query("DELETE FROM notes WHERE id = $1", [notes_id])
    }
    res.redirect(`/edit/${book_id}`)
  } catch (error) {
    console.log(error)
    res.status(500).send("An error occurred while processing your request");
  }
});


// Add a note and redirect to its page
app.post('/edit/:id/add', async (req, res) => {
  const created_notes = req.body.newNotes
  const book_id = req.body.bookId
  try {
      await db.query("INSERT INTO notes (note, book_id) VALUES ($1, $2)", [created_notes, book_id])
      res.redirect(`/edit/${book_id}`)
  } catch (error) {
      console.log(error)
  }
});


// Search any book
app.post('/search', async (req, res) => {
  const user_input = req.body.searchInput
  try {
    const response = await axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(user_input)}`);
    const info = await axios.get(`https://openlibrary.org/${response.data.docs[0].key}.json`);
    res.render("new.ejs", {new_book: response.data.docs[0], book_info: info.data, fix_desc})
  } catch (error) {
    console.log(error)
    res.status(500).send('Incorrect name of the book');
  }
})


// Filtering description
function fix_desc(info) {
  if ('description' in info) {
    let description = info.description;
    let desc_list;
    if (typeof description === "string") {
      desc_list = description.split('\r\n');
    } else {
      desc_list = description.value.split('\r\n');
    }
    return desc_list[0];
  }
  return "";
}


// Add a book to database
app.post('/search/add', async (req, res) => {
  const title = req.body.hiddenTitle
  const author = req.body.hiddenAuthor
  const date_read = req.body.bookDate
  const rating = req.body.bookRating
  const description = req.body.hiddenDesc
  const cover = req.body.hiddenCover
  try {
    await db.query("INSERT INTO books (title, author, date_read, rating, description, cover) VALUES ($1, $2, $3, $4, $5, $6)", [title, author, date_read, rating, description, cover])
    res.redirect("/")
  } catch (error) {
    console.log(error)
    res.status(500).send('Incorrect name of the book');
  }
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

