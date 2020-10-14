import { Express } from 'express';
import { PassportStatic } from 'passport';

import { isAuthenticated } from './middleware';
import bootstrapController from './controllers/bootstrapController';
import filesController from './controllers/filesController';
import authController from './controllers/AuthController';
import todosController from './controllers/TodosController';

export const router = (app: Express, passport: PassportStatic) => {
  /**
   * Files
   */
  app.get(
    '/api/files',
    isAuthenticated,
    filesController.GET.bind(filesController),
  );
  app.post(
    '/api/files',
    isAuthenticated,
    filesController.POST.bind(filesController),
  );
  app.patch(
    '/api/files/:fileId',
    isAuthenticated,
    filesController.PATCH.bind(filesController),
  );
  app.delete(
    '/api/files/:fileId',
    isAuthenticated,
    filesController.DELETE.bind(filesController),
  );

  /**
   * Todos
   */
  app.get(
    '/api/todos',
    isAuthenticated,
    todosController.GET.bind(todosController),
  );
  app.post(
    '/api/todos',
    isAuthenticated,
    todosController.POST.bind(todosController),
  );
  app.patch(
    '/api/todos/:todoId',
    isAuthenticated,
    todosController.PATCH.bind(todosController),
  );
  app.delete(
    '/api/todos/:todoId',
    isAuthenticated,
    todosController.DELETE.bind(todosController),
  );

  /**
   * Auth
   */
  app.get('/auth/sign_out', authController.signOut.bind(authController));
  app.get('/auth/google/sign_in', (req, res, next) => {
    authController.signIn(req, res, next, passport);
  });
  app.get('/auth/google/callback', (req, res, next) => {
    authController.handleCallback(req, res, next, passport);
  });

  /**
   * Bootstrap
   */
  app.get('*', bootstrapController.GET);
};
