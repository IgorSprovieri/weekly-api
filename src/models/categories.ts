import { InferSchemaType, model, Schema, Types } from "mongoose";

const categoriesSchema = new Schema({
  user_id: Types.ObjectId,
  name: { type: String },
  hexColor: {
    type: String,
    default: "#39526C",
  },
});

export type Category = InferSchemaType<typeof categoriesSchema>;

export const categoriesModel = model("categories", categoriesSchema);
