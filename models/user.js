var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//schema start --------
var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		index: true,
		unique: true,
		required: true
	},
	password: {
		type: String
	},
	name: {
		type: String
	},
	type: {
		type: String,
		required: true,
		enum: ['student', 'client']
	},
	data: {
		type: Object,
		required: false
	}
})

UserSchema.plugin(passportLocalMongoose);

//compile the above into model.
module.exports = mongoose.model("User", UserSchema);