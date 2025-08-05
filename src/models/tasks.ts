import { InferSchemaType, model, Schema, Types } from "mongoose";

const subTaskSchema = new Schema(
  { task: String, checked: Boolean },
  { _id: false }
);

const taskSchema = new Schema({
  user_id: Types.ObjectId,
  task: { type: String, default: " " },
  category: { name: String, hexColor: String },
  initialDate: Date,
  finalDate: Date,
  description: { type: String, default: " " },
  subTasks: [subTaskSchema],
  checked: { type: Boolean, default: false },
});

export type SubTask = InferSchemaType<typeof subTaskSchema>;
export type Task = InferSchemaType<typeof taskSchema>;

export const tasksModel = model("tasks", taskSchema);
