console.log("hello w")
require('dotenv').config() // need to be imported before calling modules, models ecc
const express = require('express')
const morgan = require ('morgan')
const mongoose = require('mongoose')
//morgan.token('body',function(req){return JSON.stringify(req.body)})
const Person = require('./models/persons')
const persons = require('./models/persons')

const app = express()

app.use(express.json())

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    JSON.stringify(req.body), //BODY of REQ!
    //tokens.body(req), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})
)

app.use(express.static('dist')) //to show index.html static content

/*personas=[
    { 
      "id": "1",
      "name": "Arto Hellass", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]*/

app.get('/api/personas',(request, response) => {
    Person.find({}).then(p=>{
      response.json(p)
    })
})

app.get('/api/personas/:id',(request, response) => {
  Person.findById(request.params.id).then(
    p=>{response.json(p)}
  )
})


/*app.get('/api/personas/:id',(request, response) => {
    const id=request.params.id
    console.log("id",id)
    const [selectedInfo] = personas.filter(p=>p.id===id)
    console.log(selectedInfo)
    if(selectedInfo)
    {
        response.json(selectedInfo)
    }
    else
    {
        response.statusMessage=`No persona with id ${id} found`
        response.status(404).end() //end important
    }
})*/
 
app.delete('/api/personas/:id',(request, response) => {
    const id=request.params.id
    console.log("[DELETION] id",id)
    const [selectedInfo] = personas.filter(p=>p.id===id)
    const otherPersonas = personas.filter(p=>p.id !== id)
    console.log(selectedInfo)
    if(selectedInfo)
    {
        response.statusMessage=`Persona with id ${id} succesfully deleted`
        console.log('otherPersonas',otherPersonas)
        //response.status(200).json(otherPersonas)
        response.status(204).end()
    }
    else
    {
        response.statusMessage=`No persona with id ${id} found`
        response.status(404).end() //end important
    }
})


app.post('/api/personas',(request,response) => {

    console.log("requestbody name",request.body.name)
    console.log("requestbody number",request.body.number)
    if (!request.body.number || !request.body.name)
    {
        response.statusMessage="please fill number or name"
        response.status(500).json({"error":"name or number missing"})
    }
    else
    {
      const reqName = request.body.name
      const reqNumber = request.body.number
      
      const person = new Person({name:reqName,number:reqNumber})

      person.save().then(res=>{
        console.log('saved new entry')
        response.json(res)
      })
    }

})


/*app.post('/api/personas',(request,response) => {

    console.log("requestbody name",request.body.name)
    console.log("requestbody number",request.body.number)
    if (!request.body.number || !request.body.name)
    {
        response.statusMessage="please fill number or name"
        response.status(500).json({"error":"name or number missing"})
    }
    else
    {
        const reqBody = {
        id:Math.round(Math.random()*10000),
        name: request.body.name,
        number: request.body.number 
        }

        personas=personas.concat(reqBody)
        response.json(reqBody)
    }

})*/

app.get('/info',(request, response) => {
    response.send(`Phonebook has info for ${personas.length} people.<br> ${new Date().toString()}`)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})