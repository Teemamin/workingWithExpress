const path = require('path');

//this gives us tha path to the file that is responsible for our app running
//path to the root file
module.exports = path.dirname(require.main.filename);