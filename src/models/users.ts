import { InferSchemaType, model, Schema } from "mongoose";

const usersSchema = new Schema({
  name: {
    type: String,
    default: "User Name",
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    default: "",
  },
  passwordHash: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
    default: "",
  },
  resetPasswordTokenCratedAt: {
    type: Date,
    default: null,
  },
});

export type User = InferSchemaType<typeof usersSchema>;

export const usersModel = model("users", usersSchema);
