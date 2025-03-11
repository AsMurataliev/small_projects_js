const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let clients = [
  {
    id: 0,
    firstName: "Tolya",
    lastName: "que",
    email: "tolya.que@example.com",
    createDate: new Date("2024-01-01"),
  },
  {
    id: 1,
    firstName: "Sasha",
    lasName: "Petrov",
    email: "sasha.petrov@example.com",
    createDate: new Date("2024-03-15"),
  },
];
let accounts = [
  {
    id: 0,
    clientid: 0,
    accountNumber: "ACC-1717029200000",
    balance: 1500,
    createdAt: new Date("2024-01-02"),
  },
  {
    id: 1,
    clientid: 1,
    accountNumber: "ACC-1717029200001",
    balance: 2000,
    createdAt: new Date("2024-02-16"),
  },
];

class Client {
  constructor(id, firstName, lastName, email) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.createDate = new Date();
  }
}

class Account {
  constructor(id, clientid, balance = 0) {
    this.id = id;
    this.clientid = clientid;
    this.accountNumber = "ACC-${Date.now()}";
    this.balance = balance;
    this.createDate = new Date();
  }
}

//all list
app.get("/clients", (request, response) => {
  response.json(clients);
});

//all for id
app.get("/clients/:id", (request, response) => {
  const client = clients.find((x) => x.id === parseInt(request.params.id));
  if (!client) return response.status(404).json({ error: "Клиент не найден" });
  response.json(client);
});

// all accounts
app.get("/accounts", (request, response) => {
  response.json(accounts);
});

app.get("/accounts/:id", (request, response) => {
  const account = accounts.find((x) => x.id === parseInt(request.params.id));
  if (!account) return response.status(404).json({ error: "акк не найден" });
  response.json(account);
});

// client id
app.get("/clients/:clientId", (request, response) => {
  const clientAccounts = accounts.filter(
    (x) => x.clientid === parseInt(request.params.clientId),
  );
  response.json(clientAccounts);
});

//create new  client
app.post("/clients", (request, response) => {
  const { id, firstName, lastName, email } = request.body;
  if ((!id, !firstName || !lastName || !email)) {
    return response.status(400).json({ error: "пропущено строки" });
  }

  const client = new Client(firstName, lastName, email);
  clients.push(client);
  response.status(200).json(client);
});

//create new accounts
app.post("/accounts", (request, response) => {
  const { clientid, balance } = request.body;
  const client = clients.find((x) => x.id === clientid);

  if (!client) return response.status(404).json({ error: "клиент не найден" });
  if (typeof balance !== "number" || balance < 0) {
    return response.status(400).json({ error: "баланс отрицательный" });
  }

  const account = new Account(clientid, balance);
  accounts.push(account);
  response.status(201).json(account);
});

app.delete("/clients/:id", (request, response) => {
  const index = clients.findIndex((x) => x.id === parseInt(request.params.id));
  if (index === -1)
    return response.status(404).json({ error: "client не найдена" });

  clients.splice(index, 1);
  response.status(204).send();
});

app.delete("/accounts/:id", (request, response) => {
  const index = accounts.findIndex((x) => x.id === parseInt(request.params.id));
  if (index === -1)
    return response.status(404).json({ error: "account не найдена" });

  accounts.splice(index, 1);
  response.status(204).send();
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
