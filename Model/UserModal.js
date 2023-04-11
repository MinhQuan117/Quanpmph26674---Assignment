const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
    ten: {
        type: String,
    },

    email: {
        type: String,
    },

    sdt: {
        type: Number,
    },

    password:{
        type: String
    }

});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

const UserModal = new mongoose.model('User', UserSchema);

module.exports = UserModal;
