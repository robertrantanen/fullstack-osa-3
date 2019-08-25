require('dotenv').config()
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
morgan.token('data', function(req) { return JSON.stringify(reg.data)})

app.use(morgan(' :method :url :res[content-length] - :response-time ms'))

const Person = require('./models/person')


let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]
  

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  });
});

app.get('/info', (req, res) => {
  res.send("<h3>Phonebook has info for " + persons.length + " people</h3>"
  + "<h3>" + new Date() + "</h3")
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})


app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
})


/*
  const personNames = persons.map(p => p.name)

  if (personNames.includes(body.name)) {
    return res.status(400).json({ 
      error: 'name must be unique' 
    })
  }
  */



const PORT = process.env.PORT
app.listen(PORT)