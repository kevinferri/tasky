import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cloudinary from 'cloudinary';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as session from 'express-session';
import connectMongodbSession = require('connect-mongodb-session');

import Config from './lib/Config';
import { router } from './router';
import { PassportStrategy } from './lib/PassportStrategy';

const app = express();
const PORT = Config.get('PORT');

/**
 * Parse application/json
 */
app.use(bodyParser.json({ limit: '1gb' }));
app.use(bodyParser.urlencoded({ limit: '1gb', extended: true }));

/**
 * Set static path
 */
app.use(express.static(path.join(__dirname, './../../build')));

/**
 * Connect to database
 */
mongoose.connect(Config.get('DB_URL'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.set('useCreateIndex', true);

/**
 * Set up passport strategy
 */
new PassportStrategy(passport).initStrategy();

/**
 * Set up session store
 */
const MongoDBStore = connectMongodbSession(session);
app.use(
  session({
    name: Config.get('SESSION_NAME'),
    secret: Config.get('SESSION_SECRET'),
    cookie: {
      maxAge: 3600000 * 24 * 30,
    },
    resave: true,
    saveUninitialized: true,
    rolling: true,
    store: new MongoDBStore({
      uri: Config.get('DB_URL'),
      collection: 'user_sessions',
    }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());

/**
 * Set up routes
 */
router(app, passport);

/**
 * Configure cloudinary
 */
cloudinary.v2.config({
  cloud_name: Config.get('CLOUDINARY_CLOUD_NAME'),
  api_key: Config.get('CLOUDINARY_API_KEY'),
  api_secret: Config.get('CLOUDINARY_API_SECRET'),
});

/**
 * Use ejs for view engine
 */
app.set('view engine', 'ejs');

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
