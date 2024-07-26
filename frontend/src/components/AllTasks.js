import React from "react";

const AllTasks = ({ allTasks, deleteCompletedTasks }) => {
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
  return (
    <div className="flex justify-center items-center mt-5 ml-[50px]">
      <div>
        <div className="flex justify-between">
          <h1 className="text-3xl mr-2">All Tasks</h1>
          <button
            onClick={deleteCompletedTasks}
            className="text-red-700 border border-gray-300  p-1 box-border rounded-lg"
          >
            Delete all completed Tasks
          </button>
        </div>
        <div>
          {allTasks.length === 0 ? (
            <h1 className="text-2xl text-center mt-5">No tasks found!</h1>
          ) : (
            allTasks.map((task, index) => (
              <div className="pt-1 pb-1 text-2xl" key={index}>
                <div className="border-2 p-2 my-2 rounded-xl max-w-full md:max-w-[520px] min-w-[520px] text-justify">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1>{task.title}</h1>
                      <h1 className="text-base">
                        Created: {formatDate(task.createdAt)}
                      </h1>
                      <h1 className="text-base text-red-700">
                        Deadline: {formatDate(task.dueDate)}
                      </h1>
                      <h1>
                        Status:{" "}
                        <span
                          className={`rounded-lg px-1 ${
                            task.completed ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {task.completed ? "Completed" : "Not Completed"}
                        </span>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTasks;
