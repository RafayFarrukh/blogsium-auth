import mongoose from "mongoose";
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

import joi from "joi";
const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide title"],
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: [true, "Please enter something"],
    },
    // author: {
    //   type: String,
    //   // required: [true, "Please provide Author"],
    // },
    username: {
      type: String,
      // required: true,
    },
    // likes: [
    //   {
    //     type: ObjectId,
    //     ref: "User",
    //   },
    // ],
    // comments: [
    //   {
    //     text: "String",
    //     postedBy: { type: ObjectId, ref: "User" },
    //   },
    // ],
    // postedBy: {
    //   type: ObjectId,
    //   ref: "User",
    // },
    // created_at: {
    //   type: Date,
    // },
  },
  { timestamps: true }
);

export default mongoose.model("Article", ArticleSchema);
