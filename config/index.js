const dotenv = require('dotenv')

dotenv.config()

let mongoUri = "";
let port;
let secretKey;
let jwtExpiredIn;

switch (process.env.NODE_ENV) {
    case 'development':
        mongoUri = process.env.MONGO_URI_DEVELOPMENT;
        port = process.env.PORT;
        secretKey = process.env.JWT_SECRET_KEY_DEVELOPMENT;
        jwtExpiredIn = process.env.JWT_EXPIRED_DEVELOPMENT;
        break;
    case "staging":
        mongoUri = process.env.MONGO_URI_STAGING;
        port = process.env.PORT;
        secretKey = process.env.JWT_SECRET_KEY_STAGING;
        jwtExpiredIn = process.env.JWT_EXPIRED_STAGING;
    default:
        break;
}

module.exports = {
    mongoUri,
    port,
    secretKey,
    jwtExpiredIn,
}