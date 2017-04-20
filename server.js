const express = require('express');
const path = require('path');
const shuffle = require('shuffle-array');


// import datas
const db = require('./data/artists.json');
const bestNewDb = require('./data/best-new.json');
const top10Db = require('./data/top10.json');


// randomize data
shuffle(db);


const dbLength = db.length;
let allArtists = [];
let allTags = [];


// store each all tags and artists in arrays
db.map(item => {
    allArtists.push(item.artist);
    
    item.tags.forEach(tag => {
       if (allTags.includes(tag) || /^[0-9]/.test(tag)) return;
      allTags.push(tag);
    });
});


// remove spaces and special characters
function trimString(string) {
    return string.toLowerCase().replace(/\s/g, '-').replace(/[.!_&%/:;')(+?,=]/g, '');
}

// sort tags and artists alphabetically
allArtists = allArtists.sort((a, b) => a > b);
allTags = allTags.sort((a, b) => a > b);


// create express app
let app = express();


// save assests and index path
const assetsPath = path.join(`${__dirname}/public`);
const indexPath = path.join(`${__dirname}/public/index.html`);


// return gzip for js files
app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});


// make everythin in the assests folder accessible
app.use(express.static(assetsPath));


// response API for best-new request
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


// response API for top-10 request
app.get('/api/top-10/:name', function(req, res){
    let name = trimString(req.params.name);
    let data = {data: []};
    
    top10Db.forEach(item => {
       if (name === 'all') {
           data.data.push(item.title);
       } else if (trimString(item.title) === name) {
            data.data .push(item);
       }
    });

    if (data.data.length <= 0) res.json({data: "error 404", message: "top 10 couldn't be found"});
    
    res.json(data);
});


// response API for tag request
app.get('/api/tag/:name', function(req, res){
    let name = trimString(req.params.name);
    let data = {data: []};
    
    if (name === 'all') {
        data.data = allTags;
        return res.json(data); 
    }
    
    for (let i=0; i<dbLength; i++) {
        if (db[i].tags.includes(name)) {
            data.data.push(db[i]);
        }
    }

    if (data.data.length <= 0) res.json({data: "error 404", message: "tag couldn't be found"});
    
    if (req.query.random === 'true') {
        shuffle(data.data);
    }
    
    if (req.query.limit) {
        data.data.splice(req.query.limit);
    }
    
    res.json(data);
});


// response API for artist request
app.get('/api/artist/:name', function(req, res){
    let name = trimString(req.params.name);
    let artists = [];
    let tags = [];
    let data = {data: []};
    
    if (name === 'all') {
        data.data = allArtists;
        return res.json(data); 
    }

    if (name === 'random') {
        data.data = [db[Math.floor(Math.random() * dbLength) + 1]];
        return res.json(data); 
    }
    

    // add artist itself if exist
    for (let i=0; i<dbLength; i++) {
        if (trimString(db[i].artist) === name) {
            name = db[i];
            data.data.push(name);
            break;
        }
    }

    // return error if no artist was found
    if (data.data.length <= 0) res.json({data: "error 404", message: "artist couldn't be found"});
    


    if (req.query.similar === 'true') {
        artists.push(name.artist);


        // add related artists
        name.related.map(item => {
            artists.push(item);
        });


        // loop through database for every artist tag and rate artist based on count of similar tags
        for (let i=0; i < dbLength; i++) {
            let count = 0;
            for (let t=0, tLength=name.tags.length; t < tLength; t++) {
                if (db[i].tags.includes(name.tags[t])) {
                    count++;
                }
            }
            if (count > 0 ) {
                tags.push(`${count}---${db[i].artist}`);
            }        
        }


        // sort artists based on count of tags
        tags.sort((a, b) => b.split('---')[0] - a.split('---')[0]);


        // add similar tag artists
        for (let i=0, l=tags.length; i<l; i++) {
            if (!artists.includes(tags[i].split('---')[1])) {
                artists.push(tags[i].split('---')[1]);
            }
        }


        artists.splice(10);


        // add every artists from artists array to the final data
        for (let a=0, l=artists.length; a<l; a++) {
            for (let i=0; i < dbLength; i++) {
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


// send index.html for every page
app.get('/*', function(req, res){
    res.sendFile(indexPath);
});

app.listen(8080);
