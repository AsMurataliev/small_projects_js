const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    year: 1925,
    isAvailable: true,
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    year: 1960,
    isAvailable: false,
  },
];

let readers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Smith", email: "bob@example.com" },
];

let loans = [
  {
    id: 1,
    bookId: 2,
    readerId: 1,
    loanDate: new Date("2024-01-15"),
    returnDate: null,
  },
];

// Модель книги
class Book {
  constructor(id, title, author, year) {
    (this.id = id), (this.title = title);
    this.author = author;
    this.year = year;
    this.isAvailable = true;
  }
}

// Модель читателя
class Reader {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

// Модель выдачи книги
class Loan {
  constructor(id, bookId, readerId) {
    this.id = id;
    this.bookId = bookId;
    this.readerId = readerId;
    this.loanDate = new Date();
    this.returnDate = null;
  }
}

// Книги
app.get("/books", (request, response) => {
  response.json(books);
});

app.get("/loans", (request, response) => {
  response.json(loans);
});

// создание книги
app.post("/books", (request, response) => {
  const { id, title, author, year } = request.body;
  if ((!id, !title || !author || !year)) {
    return response
      .status(400)
      .json({ error: "отсутствуют оьязательные поля" });
  }

  const book = new Book(title, author, year);
  books.push(book);
  response.status(201).json(book);
});

// изменить книгу по ид
app.put("/books/:id", (request, response) => {
  const book = books.find((x) => x.id === parseInt(request.params.id));
  if (!book) return response.status(404).json({ error: "книга не найдена" });

  const { title, author, year, isAvailable } = request.body;
  if (title) book.title = title;
  if (author) book.author = author;
  if (year) book.year = year;
  if (typeof isAvailable === "boolean") book.isAvailable = isAvailable;

  response.json(book);
});

app.delete("/books/:id", (request, response) => {
  const index = books.findIndex((x) => x.id === parseInt(request.params.id));
  if (index === -1)
    return response.status(404).json({ error: "книга не найдена" });

  books.splice(index, 1);
  response.status(204).send();
});

// Все читатели
app.get("/readers", (request, response) => {
  response.json(readers);
});

app.post("/readers", (request, response) => {
  const { id, name, email } = request.body;
  if ((!id, !name || !email)) {
    return response.status(400).json({ error: "Missing required fields" });
  }

  const reader = new Reader(name, email);
  readers.push(reader);
  response.status(201).json(reader);
});

// Выдача книг
app.post("/loans", (request, response) => {
  const { bookId, readerId } = request.body;

  const book = books.find((x) => x.id === bookId);
  if (!book) return response.status(404).json({ error: "книга не найдена" });
  if (!book.isAvailable)
    return response.status(400).json({ error: "книга не доступна" });

  const reader = readers.find((x) => x.id === readerId);
  if (!reader)
    return response.status(404).json({ error: "читатель не найден" });

  const loan = new Loan(bookId, readerId);
  loans.push(loan);

  book.isAvailable = false;
  response.status(201).json(loan);
});

// выданных книг
app.put("loans/:id", (request, response) => {
  const loan = loans.find((x) => x.id === parseInt(request.params.id));
  if (!loan) return response.status(404).json({ error: "выданных не найдено" });
  if (loan.returnDate)
    return response.status(400).json({ error: "книгу уже вернули" });

  const book = books.find((x) => x.id === loan.bookId);
  if (!book) return response.status(404).json({ error: "книга не найдена" });

  loan.returnDate = new Date();
  book.isAvailable = true;
  response.json(loan);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
