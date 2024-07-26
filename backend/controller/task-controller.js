import User from "../models/user.js";
import Task from "../models/task.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const createTask = async (req, res) => {
  try {
    console.log("request", req.body);
    const title = req.body.task.title;
    const dueDate = req.body.task.dueDate;
    const newTask = new Task({
      title,
      userId: req.body.userLocal.id,
      dueDate,
    });
    const savedTask = await newTask.save();
    res.status(201).json({ message: "Task Created successfully" });
  } catch (err) {
    console.log("Failed to create", err);
  }
};

export const returnTask = async (req, res) => {
  try {
    const taskUser = await Task.find({ userId: req.query.userLocal.id });
    const mailOption = await User.find({ _id: req.query.userLocal.id });
    res.status(200).json({
      tasks: taskUser,
      mailOption: mailOption[0].mailOption,
    });
  } catch (err) {
    console.log("error", err);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      res.status(400).json({ message: "Task Not Found" });
    }
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.log("error", err);
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;
    console.log("updateTask", updates);

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    console.log("error", error);
  }
};

export const deleteCompletedTask = async (req, res) => {
  try {
    const userId = req.params.id;
    const toDelete = await Task.find({ userId: userId, completed: true });
    const idsToDelete = toDelete.map((task) => task._id);
    const deleteResult = await Task.deleteMany({ _id: { $in: idsToDelete } });
    console.log(`${deleteResult.deletedCount} document(s) was/were deleted.`);
    res.status(200).json({
      message: `${deleteResult.deletedCount} document(s) was/were deleted.`,
    });
  } catch (error) {
    console.log("error", error);
  }
};

export const mailOptionSwitch = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    console.log("userId: " + userId);
    console.log("updates:", updates);
    const updatedOption = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    const option = updatedOption.mailOption;
    res.status(200).json({ option });
    console.log("updatedOption: " + updatedOption.mailOption);
  } catch (error) {
    console.log("error", error);
  }
};

//Mail service implementation

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const checkOverDueTasks = async () => {
  const now = Date.now();
  const overDueTasks = await Task.find({
    dueDate: { $lt: now },
    completed: false,
  });
  console.log("due tasks: ", overDueTasks);
  const userIds = overDueTasks.map((task) => task.userId.toString());
  const uniqueUserIds = [...new Set(userIds)];
  const users = await User.find({ _id: { $in: uniqueUserIds } });
  console.log("users: ", users);
  const userIdToEmailMap = {};
  const userToMailOptions = {};
  users.forEach((user) => {
    userIdToEmailMap[user._id.toString()] = user.email;
    userToMailOptions[user._id.toString()] = user.mailOption;
  });
  console.log("users: ", users);
  console.log("userIdToEmailMap: ", userIdToEmailMap);
  console.log("userToMailOption: ", userToMailOptions);

  overDueTasks.forEach((task) => {
    const userEmail = userIdToEmailMap[task.userId.toString()];
    console.log("userEmail: ", userEmail);
    if (userEmail && userToMailOptions[task.userId]) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: "Task Overdue FFS!",
        text: `Your task "${task.title}" is overdue! God damn it.`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }
  });
};
// setInterval(checkOverDueTasks, 30000);
// checkOverDueTasks();

// structure data array->object, each object each niggas title, option to turn on mail, when 3 stops
