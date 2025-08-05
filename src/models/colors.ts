import { InferSchemaType, model, Schema } from "mongoose";

const colorsSchema = new Schema({
  hexColor: {
    type: String,
  },
});

export type Colors = InferSchemaType<typeof colorsSchema>;

export const colorsModel = model("colors", colorsSchema);
