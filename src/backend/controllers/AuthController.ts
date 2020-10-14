import { NextFunction, Request, Response } from 'express';
import { PassportStatic } from 'passport';
import { Controller } from '../lib/Controller';

class AuthController extends Controller {
  async handleCallback(
    req: Request,
    res: Response,
    next: NextFunction,
    passport: PassportStatic,
  ) {
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/',
      session: true,
    })(req, res, next);
  }

  async signIn(
    req: Request,
    res: Response,
    next: NextFunction,
    passport: PassportStatic,
  ) {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res, next);
  }

  async signOut(req: Request, res: Response) {
    req.session?.destroy(() => {
      res.redirect('/');
    });
  }
}

export default new AuthController();
