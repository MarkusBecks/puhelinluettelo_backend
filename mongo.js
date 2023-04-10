const mongoose = require('mongoose');


if (process.argv.length < 3) {
    console.log('give password as first argument');
    console.log('give name as second argument');
    console.log('give number as third argument');
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url =
    `mongodb+srv://FullStack:${password}@fullstack.tfoufav.mongodb.net/puhelinLuettelo?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);


if (process.argv.length === 3) {
    console.log('phonebook:');
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
} else {
    const person = new Person({
        name,
        number
    });

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`);
        console.log(result);
        mongoose.connection.close();
    });
};




/* /* Person.find({ important: true }).then(result => {
    // ...
  })
 */
