const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const environment = require('./environment/production.js');

module.exports = app => {
	app.set('port', environment.port);
	app.set('ip', environment.ip);
	app.use(morgan('dev'));
	app.use(parser.json());
	app.use(parser.urlencoded({ extended: true }));
	app.listen(app.get('port'), app.get('ip'), () => {
		console.log(`Listening on port ${app.get('port')} in ${app.get('env')} mode...`);
	});
};
