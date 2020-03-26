const fs = require('fs');

const readLocalFile = (fileName)=> fs.readFileSync(__dirname + '/' + fileName);


exports.readLocalFile = readLocalFile;