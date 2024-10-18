const mongoose = require('mongoose');

class Chat {
    constructor() {
        this.schema = new mongoose.Schema({
            participants: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            messages: [
                {
                    sender: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                    },
                    content: {
                        type: String,
                        required: true,
                    },
                    timestamp: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
        }, {
            toJSON: {
                transform: (doc, ret) => {
                    ret.id = ret._id;
                    delete ret._id;
                    delete ret.__v;
                    return ret;
                },
            },
        });

        this.model = mongoose.model('Chat', this.schema);
    }
}

module.exports = new Chat();
