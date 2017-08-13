const next = require('next');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { trimString } = require('./utils');

const bestNewDb = require('./data/best-new.json');
const top10Db = require('./data/top10.json');
const getTags = require('./data/getTags');
const getArtists = require('./data/getArtists');
const getBestNew = require('./data/getBestNew');

// create next app
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = express();

	server.use('/static', express.static('static'));

	server.get('/api/tag/:name', (req, res) => {
		const name = trimString(req.params.name);
		let data;
		try {
			data = getTags(name, req.query);
		} catch (err) {
			return res.redirect('/404');
		}
		res.json(data);
	});

	server.get('/api/artist/:name', (req, res) => {
		const name = trimString(req.params.name);
		let data;
		try {
			data = getArtists(name, req.query);
		} catch (err) {
			return res.redirect('/404');
		}
		res.json(data);
	});

	server.get('/api/best-new', (req, res) => {
		const data = getBestNew(req.query);
		res.json(data);
	});

	server.get('/', (req, res) => {
		const tags = getTags('all', {});
		const artists = getArtists('all', {});
		const data = {
			tags: tags.data,
			artists: artists.data
		};
		return app.render(req, res, '/', data);
	});

	server.get('/best-new', (req, res) => {
		const artists = getBestNew(req.query);
		const artistNames = getArtists('all', {});
		const data = {
			artists: artists.data,
			artistNames: artistNames.data
		};
		return app.render(req, res, '/best-new', data);
	});

	server.get(['/artist', ['/tag']], (req, res) => {
		return res.redirect('/404');
	});

	server.get('/artist/:name', (req, res) => {
		let name = req.params.name;
		let artists;
		try {
			artists = getArtists(name, { similar: 'true' });
		} catch (err) {
			return res.redirect('/404');
		}
		const data = artists.data;
		return app.render(req, res, '/artist', data);
	});

	server.get('/tag/:name', (req, res) => {
		let name = req.params.name;
		let artists;
		try {
			artists = getTags(name, { random: 'true' });
		} catch (err) {
			return res.redirect('/404');
		}
		const data = artists.data;
		return app.render(req, res, '/tag', data);
	});

	server.get('*', (req, res) => {
		return handle(req, res);
	});
	server.listen(8080, err => {
		if (err) throw err;
		console.log('> Ready on 8080');
	});
});

// // response API for top-10 request
// server.get('/api/top-10/:name', function (req, res) {
// 	let name = trimString(req.params.name);
// 	let data = { data: [] };
// 	top10Db.forEach(item => {
// 		if (name === 'all') {
// 			data.data.push(item.title);
// 		} else if (trimString(item.title) === name) {
// 			data.data.push(item);
// 		}
// 	});
// 	if (data.data.length <= 0) res.json({ data: "error 404", message: "top 10 couldn't be found" });
// 	res.json(data);
// });

// // send index.html for every page
// server.get('/*', function (req, res) {
// 	res.sendFile(indexPath);
// });

