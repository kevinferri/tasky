import Todo from '../models/todoModel';
import { IRequest, IResponse } from '../interfaces';
import { Controller } from '../lib/Controller';

class TodosController extends Controller {
  async GET(req: IRequest, res: IResponse) {
    const todos = await super.query(
      req,
      Todo.find({ creatorId: super.getCurUser(req)._id }),
    );

    res.json(todos);
  }

  async POST(req: IRequest, res: IResponse) {
    const newTodo = await new Todo({
      ...super.getReqBody(req),
      ...{
        creatorId: super.getCurUser(req)._id,
      },
    }).save();
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
    res.status(204).json();
  }
}

export default new TodosController();
