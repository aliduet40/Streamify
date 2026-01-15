import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId, // one who is subscribing (subscriber bhi user)
      ref: "User",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId, // jsko user subscriber kr rh channel bhi user h jbhi to hn commnets like krte h
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
