const express = require('express');
const connectDB = require('./config/db');
const app = express();
const BodyParser = require('body-parser');

// Connect to MongoDB
connectDB();
// Init Middleware to use bodyparser to get data from req.body
app.use(express.json({ extended: false }));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

// define routes on address bar
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.get('/api/hung', (req, res) => {
    console.log(req.query);
    let name = JSON.stringify(req.query.name);
    res.status(200).end(name + "Hung is here");
});


app.get('/', (req, res) => res.send('API Runnning'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));