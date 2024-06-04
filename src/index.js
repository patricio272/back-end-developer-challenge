const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');
const config = require('../config');

const app = express();

app.use(bodyParser.json());
app.use('/api', routes);

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
