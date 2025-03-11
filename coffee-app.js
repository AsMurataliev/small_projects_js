const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let movies = [
  {
    id: 1,
    title: "Inception",
    director: "Christopher Nolan",
    duration: 148,
    genre: "Sci-Fi",
    isAvailable: true,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    duration: 175,
    genre: "Drama",
    isAvailable: true,
  },
];

let screenings = [
  {
    id: 1,
    movieId: 1,
    hall: "Hall 1",
    dateTime: new Date("2024-03-05T18:00:00"),
    availableSeats: 50,
    totalSeats: 50,
  },
  {
    id: 2,
    movieId: 2,
    hall: "Hall 2",
    dateTime: new Date("2024-03-05T20:00:00"),
    availableSeats: 30,
    totalSeats: 30,
  },
];

let tickets = [];

class Movie {
  constructor(id, title, director, duration, genre) {
    this.id = id;
    this.title = title;
    this.director = director;
    this.duration = duration;
    this.genre = genre;
    this.isAvailable = true;
  }
}

class Screening {
  constructor(id, movieId, hall, dateTime, totalSeats) {
    this.id = id;
    this.movieId = movieId;
    this.hall = hall;
    this.dateTime = new Date(dateTime);
    this.availableSeats = totalSeats;
    this.totalSeats = totalSeats;
  }
}

class Ticket {
  constructor(id, screeningId, seatNumber, clientId, price) {
    this.id = id;
    this.screeningId = screeningId;
    this.seatNumber = seatNumber;
    this.clientId = clientId;
    this.price = price;
  }
}

// Фильмы
app.get("/movies", (request, response) => {
  response.json(movies);
});

app.post("/movies", (request, response) => {
  const { id, title, director, duration, genre } = request.body;
  if ((!id, !title || !director || !duration || !genre)) {
    return response.status(400).json({ error: "обяз поля" });
  }

  const movie = new Movie(id, title, director, duration, genre);
  movies.push(movie);
  response.status(201).json(movie);
});

// Сеансы
app.get("/screenings", (request, response) => {
  response.json(screenings);
});

app.post("/screenings", (request, response) => {
  const { id, movieId, hall, dateTime, totalSeats } = request.body;
  if ((!id, !movieId || !hall || !dateTime || !totalSeats)) {
    return response.status(400).json({ error: "обяз поля" });
  }

  const movie = movies.find((x) => x.id === movieId);
  if (!movie || !movie.isAvailable) {
    return response.status(404).json({ error: "фильм не доступен" });
  }

  const screening = new Screening(movieId, hall, dateTime, totalSeats);
  screenings.push(screening);
  response.status(201).json(screening);
});

// Билеты API
app.post("/tickets", (request, response) => {
  const { id, screeningId, seatNumber, clientId, price } = request.body;
  if ((!id, !screeningId || !seatNumber || !clientId || !price)) {
    return response.status(400).json({ error: "оьязат поля" });
  }

  const screening = screenings.find((x) => x.id === screeningId);
  if (!screening) return response.status(404).json({ error: "не найден" });

  if (screening.availableSeats <= 0) {
    return response.status(400).json({ error: "не мест" });
  }

  // Проверяем, что место не занято
  const isSeatTaken = tickets.some(
    (x) => x.screeningId === screeningId && t.seatNumber === seatNumber,
  );
  if (isSeatTaken) {
    return response.status(400).json({ error: "Seat is already taken" });
  }

  const ticket = new Ticket(id, screeningId, seatNumber, clientId, price);
  tickets.push(ticket);

  screening.availableSeats -= 1;
  response.status(201).json(ticket);
});

app.get("/", (request, response) => {
  response.send("api/movies, /screenings,/tickets");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
