const express = require('express');
const morgan = require("morgan");
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(morgan("common"))

app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
