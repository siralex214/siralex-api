import TaskModel from "../../Model/Task";
import { status } from "../../types/status";

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
  },
  Mutation: {
    async createTask(
      _: any,
      {
        taskInput: { title, description },
      }: { taskInput: { title: string; description: string } }
    ) {
      const status: status = "TO DO";
      const task = new TaskModel({
        title,
        description,
        status,
      });

      await task.save();
      return task;
    },
    async updateTask(
      _: any,
      {
        id,
        taskInput: { title, description, status },
      }: {
        id: string;
        taskInput: {
          title: string;
          description: string;
          status: status;
        };
      }
    ) {
      try {
        const task = TaskModel.findByIdAndUpdate(
          id,
          {
            title,
            description,
            status,
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
