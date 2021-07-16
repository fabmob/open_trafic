const Utilities = require ( "./Utilities" );

var Environment = Utilities.ReadJson ( "./config.json" );

module.exports = Environment;