const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://federicoroccof:${password}@clusterfso.zruih0n.mongodb.net/?retryWrites=true&w=majority&appName=ClusterFSO`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    })

const Person = mongoose.model('Person', personSchema)

if(process.argv.length>3)
{
    const _name = process.argv[3]
    const _number = process.argv[4]
    console.log(`password:${password},name:${_name},number:${_number}`)   

    const person = new Person({
    name: _name,
    number: _number,
    })

    person.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
    })
}
else
{
    console.log("argv length",process.argv.length)
    Person.find({}).then(result=>{
        result.forEach(person=>{console.log(person)})
    mongoose.connection.close()}
    )
}