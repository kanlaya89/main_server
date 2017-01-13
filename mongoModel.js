var mongoose = require("mongoose")

// Create a Schema
var mongoHost = new mongoose.Schema({
	node_name: String,
	host_name: String
})

// Create a model
// module.exports.host = mongoose.model("Host", mongoHost,"hosts");
module.exports = {
	host : mongoose.model("Host", mongoHost,"hosts")
	// saveHost : function(data) {

	// }
}