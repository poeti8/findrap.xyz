const db = require('./artists.json');
const shuffle = require('shuffle-array');
shuffle(db);

const dbLength = db.length;
let allTags = [];
allTags = allTags.sort((a, b) => a > b);

db.map(item => {
  item.tags.forEach(tag => {
    if (allTags.includes(tag) || /^[0-9]/.test(tag)) return;
    allTags.push(tag);
  });
});

const getTags = (name, { random = null, limit = null }) => {
  let data = { data: [] };
  if (name === 'all') {
    data.data = allTags;
    return data;
  }
  for (let i = 0; i < dbLength; i++) {
    if (db[i].tags.includes(name)) {
      data.data.push(db[i]);
    }
  }
  if (data.data.length <= 0) throw Error;
  if (random === 'true') {
    shuffle(data.data);
  }
  if (limit) {
    data.data.splice(limit);
  }
  return data;
};

module.exports = getTags;