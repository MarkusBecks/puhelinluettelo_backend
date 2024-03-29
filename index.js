require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

morgan.token('body', req => {
    return JSON.stringify(req.body);
});

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('build'));


const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message })
    }

    next(error);
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

// ROUTES
app.get('/info', (req, res, next) => {
    Person.countDocuments({})
        .then(count => {
            const info = `<p>Phonebook has info for ${count} people</p>`;
            const date = new Date().toString();
            const response = `${info}${date}`;

            res.send(response);
        })
        .catch(error => next(error));
});

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            error: 'content missing'
        });
    } Person.find({ name: body.name })
        .then(result => {
            if (result.length > 0) {
                console.log(result);
                return res.status(400).json({
                    error: 'name must be unique'
                });
            }

            const person = new Person({
                name: body.name,
                number: body.number,
            });

            person.save()
                .then(savedPerson => {
                    res.json(savedPerson);
                })
                .catch(error => next(error));
        })
        .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body;

    Person.findByIdAndUpdate(
        req.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => next(error));
});

app.use(errorHandler);
app.use(unknownEndpoint);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});