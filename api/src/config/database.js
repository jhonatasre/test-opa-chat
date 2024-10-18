const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb://root:passwordroot@mongo:27017/opa-chat?authSource=admin';

class Database {
    async conn() {
        try {
            await mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('--- Conexão com o MongoDB estabelecida com sucesso.');
        } catch (err) {
            console.error('--- Erro ao conectar ao MongoDB:', err);
        }
    }
}

module.exports = new Database();
