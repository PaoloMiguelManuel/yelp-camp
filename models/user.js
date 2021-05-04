const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true
   }
});

// this line will add a username and password for our UserSchema which is why we didn't need to outline it above
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);