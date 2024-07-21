require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const indexRoutes = require('./routes/index');
const projectRoutes = require('./routes/projectRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');
const { isAuth } = require('./middlewares/auth');

const app = express();
const PORT = process.env.PORT || 8080;
const api_version = process.env.API_VERSION;

app.use(bodyParser.json());
app.use(passport.initialize());

app.use(`/${api_version}/`, indexRoutes);
app.use(`/${api_version}/projects`, isAuth, projectRoutes);
app.use(`/${api_version}/expenses`, isAuth, expenseRoutes);
app.use(`/${api_version}/users`, userRoutes);

// Middleware to handle database errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});