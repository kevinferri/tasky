import * as path from 'path';
import { IRequest, IResponse } from '../interfaces';
import { Controller } from '../lib/Controller';

class BootstrapController extends Controller {
  async GET(req: IRequest, res: IResponse) {
    if (req.isAuthenticated()) {
      const user = super.getCurUser(req);
      const bootstrapData = {
        viewer: {
          _id: user._id,
          email: user.email,
          name: user.name,
          picture: user.picture,
        },
      };

      res.render(path.join(__dirname, '../views/index'), {
        bundlePath: 'http://localhost:3001/bundle.min.js',
        bootstrapData,
      });
    } else {
      res.render(path.join(__dirname, '../views/loggedOut'));
    }
  }
}

export default new BootstrapController();
