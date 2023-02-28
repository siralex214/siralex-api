import mongoose, { Schema } from "mongoose";

export interface TaskDocument extends mongoose.Document {
  title: string;
  description: string;
  idUser: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    idUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model<TaskDocument>("Task", TaskSchema);

export default TaskModel;
