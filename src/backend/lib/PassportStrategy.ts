import * as passport from 'passport';
import * as passportGoogle from 'passport-google-oauth20';
import { PassportStatic } from 'passport';

import User, { IUser } from '../models/userModel';
import Config from '../lib/Config';
import { IDocumentQuery } from '../interfaces';

export class PassportStrategy {
  passport: PassportStatic;

  constructor(passport: PassportStatic) {
    this.passport = passport;
  }

  initStrategy() {
    this.passport.serializeUser((user: IUser, done) => {
      done(null, user._id);
    });

    this.passport.deserializeUser(async (id, done) => {
      const user = await (User.findById(id) as IDocumentQuery).cache();
      return done(null, user);
    });

    passport.use(
      new passportGoogle.Strategy(
        {
          clientID: Config.get('GOOGLE_AUTH_CLIENT_ID'),
          clientSecret: Config.get('GOOGLE_AUTH_CLIENT_SECRET'),
          callbackURL: Config.get('GOOGLE_AUTH_CALLBACK_URL'),
        },
        async (accessToken, refreshToken, profile, done) => {
          const currentUser = await User.findOne({ googleId: profile.id });

          if (currentUser) {
            done(null, currentUser);
          } else {
            const newUser = await new User({
              googleId: profile.id,
              googleToken: accessToken,
              name: profile.displayName,
              email: profile.emails[0].value,
              picture: profile.photos[0].value,
              refreshToken: refreshToken,
            }).save();

            done(null, newUser);
          }
        },
      ),
    );
  }
}
