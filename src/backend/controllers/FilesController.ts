import * as cloudinary from 'cloudinary';

import File from '../models/fileModel';
import { IRequest, IResponse } from '../interfaces';
import { Controller } from '../lib/Controller';
import { bustCache } from '../lib/mongooseCache';

class FilesController extends Controller {
  async GET(req: IRequest, res: IResponse) {
    const files = await super.query(
      req,
      File.find({ creatorId: super.getCurUser(req)._id }),
    );

    res.json(files);
  }

  async DELETE(req: IRequest, res: IResponse) {
    const { fileId } = super.getReqParams(req);
    const user = super.getCurUser(req);
    const fileToDelete = await File.findById(fileId, 'creatorId');

    if (!fileToDelete.creatorId.equals(user._id)) {
      return res.status(405).json();
    }

    await File.deleteOne({ _id: fileId });

    this._bustCache();
    res.status(204).json();
  }

  async PATCH(req: IRequest, res: IResponse) {
    const { fileId } = super.getReqParams(req);
    const user = super.getCurUser(req);
    const fileToPatch = await File.findById(fileId, 'creatorId');

    if (!fileToPatch.creatorId.equals(user._id)) {
      return res.status(405).json();
    }

    const file = await File.findOneAndUpdate(
      { _id: fileId },
      super.getReqBody(req),
      {
        new: true,
      },
    );

    this._bustCache();
    res.json(file);
  }

  async POST(req: IRequest, res: IResponse) {
    try {
      const { file, fileName } = super.getReqBody(req);
      const resourceType = file
        .match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
        .split('/')[0];

      const result = await cloudinary.v2.uploader.upload(
        file,
        resourceType === 'video'
          ? {
              resource_type: resourceType,
            }
          : undefined,
      );

      const newFile = await new File({
        fileName,
        creatorId: super.getCurUser(req)._id,
        fileSize: result.bytes,
        format: result.format,
        resourceType:
          resourceType === 'application' ? 'pdf' : result.resource_type,
        secureUrl: result.secure_url,
      }).save();

      this._bustCache();
      res.json(newFile);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  private _bustCache() {
    bustCache(File.collection.name);
  }
}

export default new FilesController();
