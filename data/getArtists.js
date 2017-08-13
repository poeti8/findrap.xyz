const db = require('./artists.json');
const shuffle = require('shuffle-array');
const { trimString } = require('../utils');
shuffle(db);

const dbLength = db.length;
let allArtists = [];
allArtists = allArtists.sort((a, b) => a > b);

db.map(item => {
  allArtists.push(item.artist);
});

const getArtists = (name, { similar = null, limit = null }) => {
  let artists = [];
  let tags = [];
  let data = { data: [] };
  if (name === 'all') {
    data.data = allArtists;
    return data;
  }
  if (name === 'random') {
    data.data = [db[Math.floor(Math.random() * dbLength) + 1]];
    return data;
  }
  // add artist itself if exist
  for (let i = 0; i < dbLength; i++) {
    if (trimString(db[i].artist) === name) {
      name = db[i];
      data.data.push(name);
      break;
    }
  }
  // return error if no artist was found
  if (data.data.length <= 0) throw Error;
  if (similar === 'true') {
    artists.push(name.artist);
    // add related artists
    name.related.map(item => {
      artists.push(item);
    });
    // loop through database for every artist tag and rate artist based on count of similar tags
    for (let i = 0; i < dbLength; i++) {
      let count = 0;
      for (let t = 0, tLength = name.tags.length; t < tLength; t++) {
        if (db[i].tags.includes(name.tags[t])) {
          count++;
        }
      }
      if (count > 0) {
        tags.push(`${count}---${db[i].artist}`);
      }
    }
    // sort artists based on count of tags
    tags.sort((a, b) => b.split('---')[0] - a.split('---')[0]);
    // add similar tag artists
    for (let i = 0, l = tags.length; i < l; i++) {
      if (!artists.includes(tags[i].split('---')[1])) {
        artists.push(tags[i].split('---')[1]);
      }
    }
    artists.splice(10);
    // add every artists from artists array to the final data
    for (let a = 0, l = artists.length; a < l; a++) {
      for (let i = 0; i < dbLength; i++) {
        if (db[i].artist === artists[a] && db[i].artist !== name.artist) {
          data.data.push(db[i]);
        }
      }
    }
  }
  if (limit) {
    data.data.splice(limit);
  }

  return data;
};

module.exports = getArtists;