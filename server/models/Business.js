import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      required: true,
    },
    businessReg: {
      type: String,
      min: 3,
      required: true,
    },
    online: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Business = mongoose.model("Business", BusinessSchema);
export default Business;
