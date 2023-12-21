import Queue from "../models/Queue.js";
import User from "../models/User.js";
import Business from "../models/Business.js";

/* CREATE */
export const createQueue = async (req, res) => {
  try {
    const { userId, businessId } = req.params;

    // Check if user has existing queue
    const existingQueue = await Queue.findOne({ userId });

    if (existingQueue) {
      // User already has a queue, you may choose to update the existing queue or respond accordingly
      return res.status(409).json({ message: 'User already has a queue' });
    }

    // Logic for queue numbering
    const maxQueue = await Queue.findOne({ businessId }).sort({ queueNumber: -1 });
    const nextQueueNumber = maxQueue ? maxQueue.queueNumber + 1 : 1;

    // Save queue in db
    const newQueue = new Queue({
      userId,
      businessId,
      queueNumber: nextQueueNumber,
    });
    await newQueue.save();

    // return queue as response
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