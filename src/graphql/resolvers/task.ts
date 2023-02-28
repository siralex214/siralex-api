import { Request } from "express";
import TaskModel from "../../Model/Task";
import { role } from "../../types/role";
import { status } from "../../types/status";
import checkAuth from "../../utils/checkAuth";

export default {
  Query: {
    async tasks() {
      return await TaskModel.find();
    },
    async task(_: any, { id }: { id: string }) {
      try {
        const task = TaskModel.findById(id);
        return task;
      } catch (error) {
        throw new Error(error);
      }
    },
    async tasksByUser(_: any, __: any, context: { req: Request }) {
      const user = await checkAuth(context, role.user);

      if (!user) {
        throw new Error("Not authorized");
      }

      return await TaskModel.find({ idUser: user.id });
    },
  },
  Mutation: {
    async createTask(
      _: any,
      {
        taskInput: { title, description },
      }: { taskInput: { title: string; description: string } },
      context: { req: Request }
    ) {
      const user = await checkAuth(context, role.user);

      if (!user) {
        throw new Error("Not authorized");
      }

      const status: status = "TO DO";
      const task = new TaskModel({
        title,
        description,
        status,
        idUser: user.id,
      });

      await task.save();
      return task;
    },
    async updateTask(
      _: any,
      {
        id,
        taskInput: { title, description },
      }: {
        id: string;
        taskInput: {
          title: string;
          description: string;
        };
      }
    ) {
      try {
        const task = TaskModel.findByIdAndUpdate(
          id,
          {
            title,
            description,
          },
          { new: true }
        );
        return task;
      } catch (error) {
        throw new Error(error);
      }
    },
    async deleteTask(_: any, { id }: { id: string }) {
      try {
        const task = TaskModel.findByIdAndDelete(id);
        return task;
      } catch (error) {
        throw new Error(error);
      }
    },
    async checkTask(_: any, { id }: { id: string }) {
      try {
        const status: status = "DONE";
        const task = TaskModel.findByIdAndUpdate(
          id,
          {
            status: status,
          },
          { new: true }
        );
        return task;
      } catch (error) {
        throw new Error(error);
      }
    },
    async uncheckTask(_: any, { id }: { id: string }) {
      const status: status = "TO DO";
      try {
        const task = TaskModel.findByIdAndUpdate(
          id,
          {
            status: status,
          },
          { new: true }
        );
        return task;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
