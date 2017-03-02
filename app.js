const express = require('express'),
      path = require('path');

let app = express();

let assetsPath = path.join(`${__dirname}/public`)
let indexPath = path.join(`${__dirname}/public/index.html`);

app.use(express.static(assetsPath));

app.get('*', function(req, res){
  res.send('404');
});

app.listen(3000);
