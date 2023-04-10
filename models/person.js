const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const phoneRegex = /^[0-9]{2,3}-[0-9]+$/;
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        required: true
    },

    number: {
        type: String,
        minlength: 8,
        required: true,
        validate: {
            validator: function (val) {
                return phoneRegex.test(val);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)