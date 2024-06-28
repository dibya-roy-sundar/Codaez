if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/user');
const detailsRoutes = require('./routes/details');
const error = require('./middlewares/error');

const dbUrl = process.env.ATLAS_URL;
mongoose.connect(dbUrl)
    .then(() => {
        console.log('mongo database connected');
    })
    .catch((err) => {
        console.log('mongo connection error!!');
        console.log(err);
    })



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));


app.use('/api/v1', userRoutes);
app.use('/api/v1/details', detailsRoutes);

app.use(error);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})