const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const indexRouter = require('./routes/index');
const entriesRouter = require('./routes/entry');

const uri = `mongodb+srv://ctellezesp:${process.env.PASSWORD}@cluster0.m6rjg.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 8080;

mongoose.connect(uri , {
	useNewUrlParser: true, useUnifiedTopology: true
});

const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/entries', entriesRouter);
app.get('*', (req,res) => {
	res.status(404).send('Route not found');
});
app.use((error, req, res, next) => {
	if(error) {
		res.status(422).json({
			message: error.message,
			type: error.name
		})
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;