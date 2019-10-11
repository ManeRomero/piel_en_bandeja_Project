const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    user_name: String,
    user_email: String,
    user_pass: String,
    user_token: String,
    user_hash: String
})

UserSchema.methods.codePass = async (pass) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(pass, salt)
}

UserSchema.methods.validaPass = function (pass) {
    return bcrypt.compare(pass, this.user_pass)
}

module.exports = model('User', UserSchema)