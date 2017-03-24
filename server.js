const express = require('express');
const path = require('path');
const axios = require('axios');
const shuffle = require('shuffle-array');
const fs = require('fs');

const db = require('./data/artists.json');
const bestNewDb = require('./data/best-new.json');
const top10Db = require('./data/top10.json');

const dbLength = db.length;
let allArtists = [];
let allTags = [];

db.map(item => {
    allArtists.push(item.artist);
    
    item.tags.forEach(tag => {
       if (allTags.includes(tag) || /^[0-9]/.test(tag)) return;
      allTags.push(tag);
    });
});

function noSpaceCase(string) {
    return string.toLowerCase().replace(/ /g, '-');
}
//
//function getSpotifyId(artist, query, type, songAlbum) {
//    axios.get(`https://api.spotify.com/v1/search?q=${query}&type=${type}`, {responseType: 'json'})
//    .then(res => {
//        const dataType = `${type}s`;
//        res.data[dataType].items.forEach(item => {
//            if (noSpaceCase(item.name) === noSpaceCase(query) && noSpaceCase(item.artists[0].name) === noSpaceCase(artist.artist)) {              
//                if (type === 'album' && item.album_type === "album") {
//                    return item.id;
//                } else if (type === 'track' && noSpaceCase(item.album.name) === noSpaceCase(songAlbum)) { 
//                    fs.appendFile(__dirname + '/data/text.txt', '---' + item.id);
//                    return item.id;           
//                } 
//            }
//        });
//    })
//    .catch(err =>{
//        console.log(err);
//    });  
//}
//
//db.map(artist => {
//    artist.songs.map(song => {
//        song.spotify = getSpotifyId(artist, song.name,  'track', song.album);
//    });
//});

allArtists = allArtists.sort((a, b) => a > b);
allTags = allTags.sort((a, b) => a > b);

let app = express();

const assetsPath = path.join(`${__dirname}/public`);
const indexPath = path.join(`${__dirname}/public/index.html`);

app.use(express.static(assetsPath));

app.get('/api/best-new', function(req, res){
    let data = {data: bestNewDb};
    
    if (req.query.random === 'true') {
        shuffle(data.data);
    }
    
    if (req.query.limit) {
        data.data.splice(req.query.limit);
    }
    
    res.json(data);
});

app.get('/api/top-10/:name', function(req, res){
    let name = req.params.name.toLowerCase().replace(/ /g, '-');
    let data = {data: []};
    
    top10Db.forEach(item => {
       if (name === 'all') {
           data.data.push(item.title);
       } else if (item.title.toLowerCase().replace(/ /g, '-') === name) {
            data.data .push(item);
       }
    });
    
    res.json(data);
});

app.get('/api/tag/:name', function(req, res){
    let name = req.params.name.toLowerCase().replace(/ /g, '-');
    let data = {data: []};
    
    if (name === 'all') {
        data.data = allTags;
        res.json(data); 
    }
    
    for (let i=0; i<dbLength; i++) {
        if (db[i].tags.includes(name)) {
            data.data.push(db[i]);
        }
    }
    
    if (req.query.random === 'true') {
        shuffle(data.data);
    }
    
    if (req.query.limit) {
        data.data.splice(req.query.limit);
    }
    
    res.json(data);
});

app.get('/api/artist/:name', function(req, res){
    let name = req.params.name.toLowerCase().replace(/ /g, '-');
    let artists = [];
    let tags = {}; 
    let data = {data: []};
    
    if (name === 'all') {
        data.data = allArtists;
        res.json(data); 
    }
    
    for (let i=0; i<dbLength; i++) {
        if (db[i].artist.toLowerCase().replace(/ /g, '-') === name) {
            name = db[i];
            data.data.push(name);
            break;
        }
    }
    
    if (req.query.similar === 'true') {
        artists.push(name.artist);
        name.related.map(item => {
            artists.push(item);
        });

        for (let i=0; i < dbLength; i++) {
            let count = 0;
            for (let t=0, tLength=name.tags.length; t < tLength; t++) {
                if (db[i].tags.includes(name.tags[t])) {
                    count++;
                }
            }

            if (count > 1) {
                tags[db[i].artist] = count;
            }
        }

        tags = Object.keys(tags).sort((a, b) => {
            return tags[a] < tags[b];
        });

        for (let i=0, l=tags.length; i<l; i++) {
            if (!artists.includes(tags[i])) {
                artists.push(tags[i]);
            }
        }
        
        for (i=0; i < dbLength; i++) {
            for (let a=0, l=artists.length; a<l; a++) {
                if (db[i].artist === artists[a] && db[i].artist !== name.artist) {
                    data.data.push(db[i]);
                }
            }
        }
    }
    
    if (req.query.limit) {
        data.data.splice(req.query.limit);
    }

    res.json(data);
});

app.get('/*', function(req, res){
    res.sendFile(indexPath);
});

app.listen(3000);
