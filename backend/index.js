const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors({ origin: ['http://localhost:3001', 'http://localhost:8081'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes'));

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = server;
