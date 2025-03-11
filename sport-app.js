const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let trainers = [
  {
    id: 1,
    name: "John Smith",
    specialization: "Fitness",
    email: "john@example.com",
  },
  {
    id: 2,
    name: "Alice Brown",
    specialization: "Yoga",
    email: "alice@example.com",
  },
];

let clients = [
  { id: 1, name: "Bob Johnson", age: 25, membershipType: "Monthly" },
  { id: 2, name: "Sarah Lee", age: 30, membershipType: "Yearly" },
];

let classes = [
  {
    id: 1,
    trainerId: 1,
    title: "Morning Fitness",
    dateTime: new Date("2024-03-01T08:00:00"),
    capacity: 10,
    participants: [1],
  },
  {
    id: 2,
    trainerId: 2,
    title: "Evening Yoga",
    dateTime: new Date("2024-03-01T18:00:00"),
    capacity: 5,
    participants: [],
  },
];

class Trainer {
  constructor(id, name, specialization, email) {
    this.id = id;
    this.name = name;
    this.specialization = specialization;
    this.email = email;
  }
}

class Client {
  constructor(id, name, age, membershipType) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.membershipType = membershipType;
  }
}

class Class {
  constructor(id, trainerId, title, dateTime, capacity) {
    this.id = id;
    this.trainerId = trainerId;
    this.title = title;
    this.dateTime = new Date(dateTime);
    this.capacity = capacity;
    this.participants = [];
  }
}

app.get("/trainers", (reauest, response) => {
  response.json(trainers);
});

app.post("/trainers", (request, response) => {
  const { id, name, specialization, email } = request.body;
  if ((!id, !name || !specialization || !email)) {
    return response.status(400).json({ error: "пропущенны обязательные поля" });
  }

  const trainer = new Trainer(name, specialization, email);
  trainers.push(trainer);
  response.status(201).json(trainer);
});

app.get("/clients", (request, response) => {
  response.json(clients);
});

app.post("/clients", (request, response) => {
  const { id, name, age, membershipType } = request.body;
  if ((!id, !name || !age || !membershipType)) {
    return response.status(400).json({ error: "пропущенны обязательные поля" });
  }

  const client = new Client(id, name, age, membershipType);
  clients.push(client);
  response.status(201).json(client);
});

app.get("/classes", (request, response) => {
  response.json(classes);
});

app.post("/classes", (request, response) => {
  const { trainerId, title, dateTime, capacity } = request.body;
  if (!trainerId || !title || !dateTime || !capacity) {
    return response.status(400).json({ error: "пропустили обязательные поля" });
  }

  const trainer = trainers.find((x) => x.id === trainerId);
  if (!trainer)
    return response.status(404).json({ error: "Джим мастер не найден" });

  const newClass = new Class(trainerId, title, dateTime, capacity);
  classes.push(newClass);
  response.status(201).json(newClass);
});

// Запись клиента на занятие
app.post("/classes/:id", (request, response) => {
  const cls = classes.find((x) => x.id === parseInt(request.params.id));
  if (!cls) return response.status(404).json({ error: "Class not found" });

  const { clientId } = request.body;
  const client = clients.find((x) => x.id === clientId);
  if (!client) return response.status(404).json({ error: "Client not found" });

  if (cls.participants.includes(clientId)) {
    return res.status(400).json({ error: "клиент уже зареган в этом классе" });
  }

  if (cls.participants.length >= cls.capacity) {
    return response.status(400).json({ error: "кдасс заполнен" });
  }

  cls.participants.push(clientId);
  response.json(cls);
});

app.get("/", (request, response) => {
  response.send("Visit /trainers, /clients, or /classes for more information.");
});

// Запуск сервера
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
