const db = require('./best-new.json');
const shuffle = require('shuffle-array');

const getBestNew = ({ random = null, limit = null }) => {
  let data = { data: db };
  if (random === 'true') {
    shuffle(data.data);
  }
  if (limit) {
    data.data.splice(limit);
  }
  return data;
};

module.exports = getBestNew;