import mongoose from "mongoose";
// moongoose aggregate pipelining uses as a plugin

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, // get from cloudinary
      required: true,
    },

    thumbnail: {
      type: String, // get from cloudinary
      required: true,
    },

    videoFile: {
      type: String, // get from cloudinary
      required: [true, "Video is mandotory"],
    },

    views: {
      type: String,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);
