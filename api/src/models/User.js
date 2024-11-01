const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

class User {
    constructor() {
        this.schema = new mongoose.Schema({
            name: {
                type: String,
                required: true,
            },
            username: {
                type: String,
                required: true,
                unique: true,
            },
            password: {
                type: String,
                required: true,
            },
        }, {
            toJSON: {
                transform: (doc, ret) => {
                    ret.id = ret._id;
                    delete ret._id;
                    delete ret.__v;
                    delete ret.password;
                    return ret;
                },
            },
        });

        this.schema.pre('save', async function (next) {
            if (this.isModified('password') || this.isNew) {
                const salt = await bcrypt.genSalt(10);
                this.password = await bcrypt.hash(this.password, salt);
            }

            next();
        });

        this.model = mongoose.model('User', this.schema);
    }

    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    generateJWT(user) {
        return jwt.sign(
            { id: user.id, username: user.username },
            (process.env.JWT_SECRET || 'my-secret-jwt-token'),
            { expiresIn: '1h' }
        );
    }
}

module.exports = new User();
