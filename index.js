const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

morgan.token('content', function getContent (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// index
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// get all persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// get person info
app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

// get person by id
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

// delete person by id
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

// generate id and add new item
const generateId = () => {
  return parseInt(Math.random() * 10000)
}

app.post('/api/persons', (request, response) => {
  
const body = request.body
console.log(body)

if (!body.name||!body.number) {
  return response.status(400).json({ 
  error: 'content value missing' 
  })
}else if(persons.find(person => person.name === body.name)){
  return response.status(400).json({ 
    error: 'name must be unique' 
  })
}

const person = {
  id: generateId(),
  name: body.name,
  number: body.number
}

persons = persons.concat(person)

response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})