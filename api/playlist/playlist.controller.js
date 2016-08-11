const { handleError } = require('../../utils');
const Playlist = require('./playlist.model');

const controller = {};

controller.getAll = (req, res) => {
  Playlist.find({}).exec()
    .then(playlists => res.send(playlists))
    .catch(handleError(res));
};

controller.getOne = (req, res) => {
  Playlist.findOne({req.body.id}).exec()
  	.then(playlists => res.send(playlists))
  	.catch(handleError(res));
};
controller.createList = (req, res) => {
	const { name, owner } = req.body
	Playlist.create({name, owner})
		.then(playlist => controller.getAll(req, res))
		.catch(handleError(res));
};

controller.deleteList = (req, res) => {
	Playlist.remove({}).exec()
		.then(response => res.send(response))
		.catch(handleError(res));
};

controller.addToList = (req, res) => {
	const { id, p_id } = req.body
	Playlist.findOne({id}).exec()
		.then(list => Playlist.podcasts.push(p_id))
		.then(response => res.send(response))
		.catch(handleError(res));
};

controller.removeFromList = (req, res) => {
	const { id, p_id } = req.body
	Playlist.findOne({id}).exec()
		.then(list => console.log("need to delete playlist", list))
		.then(response => res.send(response))
		.catch(handleError(res));
};


module.exports = controller;
