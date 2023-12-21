import Queue from "../models/Queue.js";
import User from "../models/User.js";
import Business from "../models/Business.js";

/* CREATE */
export const createQueue = async (req, res) => {
  try {
    const { userId, businessId } = req.params;
    const maxQueue = await Queue.findOne({ businessId }).sort({ queueNumber: -1 });
    const nextQueueNumber = maxQueue ? maxQueue.queueNumber + 1 : 1;

    const user = await User.findById(userId);
    const business = await Business.findById(businessId)
    const newQueue = new Queue({
      userId,
      businessId,
      queueNumber: nextQueueNumber,
    });
    await newQueue.save();

    const queue = await Queue.find();
    res.status(201).json(queue);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getBusinessQueue = async (req, res) => {
  try {
    const { businessId } = req.params;
    const queue = await Queue.find({ userId });
    res.status(200).json(queue);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserQueue = async (req, res) => {
  try {
    const { userId } = req.params;
    const queue = await Queue.findOne({ userId });
    res.status(200).json(queue);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const removeQueue = async (req, res) => {
  try {
    const { id } = req.params;

    const existingQueue = await Queue.findById(id);
    if (!existingQueue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    await Queue.findByIdAndRemove(id);

    res.status(200).json(existingQueue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};