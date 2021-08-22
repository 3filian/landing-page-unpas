const mongoose = require('mongoose')

// mongoose.connect('mongodb://127.0.0.1:27017/unpas', 
mongoose.connect('mongodb+srv://3filian:admin@cluster0.jfidc.mongodb.net/unpas?retryWrites=true&w=majority', 
{
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
});
