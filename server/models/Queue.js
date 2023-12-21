import mongoose from "mongoose";

const queueSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    businessId: {
      type: String,
      required: true,
    },
    queueNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Queue = mongoose.model("Queue", queueSchema);

export default Queue;
