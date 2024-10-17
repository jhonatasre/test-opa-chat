const bcrypt = require('bcrypt');
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

    async create(data) {
        const user = new this.model(data);
        return await user.save();
    }
}

module.exports = new User();
