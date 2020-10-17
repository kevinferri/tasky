import Todo from '../models/todoModel';
import { IRequest, IResponse } from '../interfaces';
import { Controller } from '../lib/Controller';
import { bustCache } from '../lib/mongooseCache';

class TodosController extends Controller {
  async GET(req: IRequest, res: IResponse) {
    const user = super.getCurUser(req);
    const todos = await super.query(req, Todo.find({ creatorId: user._id }));

    res.json(todos);
  }

  async POST(req: IRequest, res: IResponse) {
    const newTodo = await new Todo({
      ...super.getReqBody(req),
      ...{
        creatorId: super.getCurUser(req)._id,
      },
    }).save();

    this._bustCache();
    res.json(newTodo);
  }

  async PATCH(req: IRequest, res: IResponse) {
    const { todoId } = super.getReqParams(req);
    const user = super.getCurUser(req);
    const todoToPatch = await Todo.findById(todoId, 'creatorId');

    if (!todoToPatch.creatorId.equals(user._id)) {
      return res.status(405).json();
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: todoId },
      super.getReqBody(req),
      {
        new: true,
      },
    );

    this._bustCache();

    res.json(todo);
  }

  async DELETE(req: IRequest, res: IResponse) {
    const { todoId } = super.getReqParams(req);
    const user = super.getCurUser(req);
    const todoToDelete = await Todo.findById(todoId, 'creatorId');

    if (!todoToDelete.creatorId.equals(user._id)) {
      return res.status(405).json();
    }

    await Todo.deleteOne({ _id: todoId });
    this._bustCache();

    res.status(204).json();
  }

  private _bustCache() {
    bustCache(Todo.collection.name);
  }
}

export default new TodosController();
