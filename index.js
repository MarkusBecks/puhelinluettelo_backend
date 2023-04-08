const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

morgan.token('body', req => {
    return JSON.stringify(req.body);
});

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

// ROUTES & HELPER FUNCTIONS
app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
})

const generateId = () => {
    const random = Math.floor(Math.random() * 9999999999999);
    return random;
}

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const nameExists = persons.find(person => person.name === body.name);

    if (!body.name) {
        return res.status(400).json({
            error: 'you must provide a name'
        })
    } if (!body.number) {
        return res.status(400).json({
            error: 'you must provide a number'
        })
    } if (nameExists) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    res.json(person);
})

app.get('/info', (req, res) => {
    const info = `<p>Phonebook has info for ${persons.length} people</p>`;
    const date = new Date().toString();
    const response = `${info}${date}`;

    res.send(response);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);

    res.status(204).end();
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);


const PORT = 3001;
app.listen(PORT);
console.log(`Server running on ${PORT}`);