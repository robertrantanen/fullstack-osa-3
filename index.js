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

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  /*
  const personNames = persons.map(p => p.name)

  if (personNames.includes(body.name)) {
    return res.status(400).json({ 
      error: 'name must be unique' 
    })
  }
  */

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})




const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT)