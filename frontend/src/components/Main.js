import React from "react";
import Navbar from "./Navbar";
import { useState, useEffect, useRef } from "react";
import { GoTasklist } from "react-icons/go";
import { FaCheck } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { GrAdd } from "react-icons/gr";
import FactGPT from "./FactGPT";
import axios from "axios";
import AllTasks from "./AllTasks";

const Main = () => {
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
  });
  const [recivedTask, setRecivedTask] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [userLocal, setUserLocal] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [line, setLine] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const [isButtonActive, setIsButtonActive] = useState(false);

  const [toggle, setToggle] = useState(null);
  const handleToggle = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  const mailOptionSwitch = async (currentState) => {
    const userId = userLocal.id;
    console.log("userId: " + userId);
    const updates = { mailOption: currentState };
    const response = await axios.put(
      `http://localhost:5000/api/task/mailOptionSwitch/${userId}`,
      updates
    );
    console.log("response --> ", response.data.option);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();
    try {
      const payload = { userLocal: userLocal, task: newTask };
      console.log("payload", payload);
      const resp = await axios.post(
        "http://localhost:5000/api/task/createTask",
        payload
      );
      alert(resp.data.message);
      setNewTask({ title: "" });
      fetchData();
    } catch (err) {
      console.log("Error", err);
    }
  };

  const handleRemove = async (index) => {
    const taskId = recivedTask[index]._id;
    try {
      const resp = await axios.delete(
        `http://localhost:5000/api/task/deleteTask/${taskId}`
      );
      alert(resp.data.message);
      fetchData();
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleComplete = async (index) => {
    const taskId = recivedTask[index]._id;
    if (recivedTask[index].completed === false) {
      const updateTask = { completed: true };
      const response = await axios.put(
        `http://localhost:5000/api/task/updateTask/${taskId}`,
        updateTask
      );
      alert(response.data.message);
      const completedTask = response.data.updatedTask;
      setCompletedTasks([...completedTasks, completedTask]);
      fetchData();
    } else {
      return;
    }
  };

  const handleCompleteDeleted = async () => {
    const userId = userLocal.id;
    try {
      const resp = await axios.delete(
        `http://localhost:5000/api/task/deleteCompletedTask/${userId}`
      );
      alert(resp.data.message);
      fetchData();
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchData = async () => {
    try {
      if (userLocal) {
        const resp = await axios.get(
          "http://localhost:5000/api/task/returnTask",
          {
            params: { userLocal: userLocal },
          }
        );
        setRecivedTask(resp.data.tasks);
        setToggle(resp.data.mailOption);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-GB", options);
  };

  const currentTime = new Date();
  const getGreeting = (date) => {
    const hours = date.getHours();
    if (hours < 12) {
      return "Good Morning";
    } else if (hours < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };
  const greeting = getGreeting(currentTime);

  const fact = async () => {
    try {
      const response = await axios.get(`https://api.api-ninjas.com/v1/facts`, {
        headers: { "X-Api-Key": `6UD02GPqJo/tz1BSxG0uNg==aQ0b8zOrfwkXx832` },
      });
      console.log(response.data[0].fact);
      setLine(response.data[0].fact);
    } catch (error) {
      console.error(
        "Error: ",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleAllTaskButton = () => {
    setIsButtonActive(!isButtonActive);
    setActiveButton((prevState) => !prevState);
  };

  useEffect(() => {
    // fact();
    const userData = localStorage.getItem("user");
    if (userData) {
      setUserLocal(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      fetchData();
    }
  }, [isLoading, userLocal]);

  useEffect(() => {
    const userId = userLocal.id;
    if (userId != undefined) {
      mailOptionSwitch(toggle);
    }
  }, [toggle]);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col md:flex-row">
        <div className="pt-5 pb-5 px-4 md:px-5 w-full md:w-[250px] flex justify-center ">
          <div>
            <div className="flex items-center p-2">
              <h1 className="text-2xl">{userLocal.name}</h1>
            </div>
            <button
              className={`flex justify-center items-center p-1 mb-1 border ${
                isButtonActive
                  ? "border-green-500 rounded-lg"
                  : "border-gray-300 rounded-lg"
              }`}
              onClick={handleAllTaskButton}
            >
              <GoTasklist />
              <h1 className="pl-2">All Tasks</h1>
            </button>
            <div className="flex items-center justify-center mt-1">
              <button
                onClick={handleToggle}
                className={`font-semibold text-white rounded-lg focus:outline-none p-2 ${
                  toggle ? "bg-green-500" : "bg-red-500"
                }`}
              >
                Send Reminder Mail
              </button>
              <div className="flex items-center justify-center w-10">
                <p className="text-center">{toggle ? "ON" : "OFF"}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          {activeButton ? (
            <AllTasks
              allTasks={recivedTask}
              deleteCompletedTasks={handleCompleteDeleted}
            />
          ) : (
            <>
              <div className="px-2 md:pl-[100px] pt-5 flex-1">
                <div>
                  <h1 className="text-3xl font-semibold">
                    {greeting}, {userLocal.name}
                  </h1>
                </div>
                <div>
                  {recivedTask.map((task, index) =>
                    task.completed ? null : (
                      <div className="pt-1 pb-1 text-2xl" key={index}>
                        <div className="border-2 p-2 my-2 rounded-xl max-w-full md:max-w-[520px] text-justify">
                          <div className="flex justify-between items-center">
                            <div>
                              <h1>{task.title}</h1>
                              <h1 className="text-base">
                                Created: {formatDate(task.createdAt)}
                              </h1>
                              <h1 className="text-base text-red-700">
                                Deadline: {formatDate(task.dueDate)}
                              </h1>
                            </div>
                            <div className="flex">
                              <FaCheck
                                className="mr-3 transition-transform hover:scale-110"
                                onClick={() => handleComplete(index)}
                              />
                              <RxCross1
                                className="transition-transform hover:scale-110"
                                onClick={() => handleRemove(index)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="text-2xl w-[520px] border-2 p-2 mt-4 mb-5 rounded-xl">
                  <form onSubmit={handleSubmitTest}>
                    <div className="mb-4">
                      <textarea
                        rows="2"
                        name="title"
                        type="text"
                        value={newTask.title || ""}
                        onChange={handleChange}
                        placeholder="Enter Task"
                        required
                        className="w-[500px] p-2 border rounded"
                      ></textarea>
                    </div>
                    <div className="mb-4">
                      <input
                        type="datetime-local"
                        name="dueDate"
                        value={newTask.dueDate || ""}
                        onChange={handleChange}
                        required
                        className="w-[500px] p-2 border rounded"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button type="submit">
                        <GrAdd className="transition-transform hover:scale-110 hover:rotate-180" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="pt-5 pl-[80px] w-full md:w-auto">
                <FactGPT fact={line} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
