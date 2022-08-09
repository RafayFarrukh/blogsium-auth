import mongoose from "mongoose";
const dbConnect = (link) => {
  return mongoose.connect(link);
};
export default dbConnect;
