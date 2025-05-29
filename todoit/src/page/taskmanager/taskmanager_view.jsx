import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import TaskCard from "../../componet/taskcard";
import CatTaskModal from "../../componet/taskmodal";
import { PlusCircle, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import './taskmanager_view.css'
import { CreateSubTask, CreateTask, DeleteSubTask, DeleteTask, GetAllTaskByUserId, ToggleSubTask, UpdateTask } from "../../service/task_service";
import { showError } from "../../componet/alertCustom/alertcusrom";

// SVG Cat Background Component
const CatBackground = ({ darkMode }) => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <svg
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full object-cover ${darkMode ? 'text-blue-300' : 'text-amber-800'}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="catPattern" patternUnits="userSpaceOnUse" width="120" height="120">
          {/* Stars for night mode */}
          {darkMode && (
            <>
              <circle cx="15" cy="15" r="1" fill="#FFFFFF" fillOpacity="0.8" />
              <circle cx="35" cy="25" r="1.5" fill="#FFFFFF" fillOpacity="0.6" />
              <circle cx="85" cy="15" r="1" fill="#FFFFFF" fillOpacity="0.7" />
              <circle cx="55" cy="35" r="1" fill="#FFFFFF" fillOpacity="0.8" />
              <circle cx="75" cy="55" r="1.5" fill="#FFFFFF" fillOpacity="0.7" />
              <circle cx="95" cy="75" r="1" fill="#FFFFFF" fillOpacity="0.6" />
              <circle cx="115" cy="95" r="1" fill="#FFFFFF" fillOpacity="0.8" />
              <circle cx="25" cy="95" r="1.5" fill="#FFFFFF" fillOpacity="0.7" />
              <circle cx="105" cy="45" r="1" fill="#FFFFFF" fillOpacity="0.6" />
            </>
          )}

          {/* Cat face outline */}
          <circle cx="60" cy="60" r="25" fill="none" strokeWidth="2" strokeOpacity="0.2" stroke="currentColor" />
          {/* Cat ears */}
          <path d="M45 40 L35 25 L45 45 Z" fillOpacity="0.15" fill="currentColor" />
          <path d="M75 40 L85 25 L75 45 Z" fillOpacity="0.15" fill="currentColor" />
          {/* Cat eyes */}
          <ellipse cx="50" cy="55" rx="5" ry="7" fillOpacity="0.15" fill="currentColor" />
          <ellipse cx="70" cy="55" rx="5" ry="7" fillOpacity="0.15" fill="currentColor" />
          {/* Cat nose */}
          <path d="M60 65 L57 70 L63 70 Z" fillOpacity="0.15" fill="currentColor" />
          {/* Cat whiskers */}
          <line x1="40" y1="65" x2="25" y2="60" strokeWidth="1" strokeOpacity="0.15" stroke="currentColor" />
          <line x1="40" y1="70" x2="25" y2="70" strokeWidth="1" strokeOpacity="0.15" stroke="currentColor" />
          <line x1="40" y1="75" x2="25" y2="80" strokeWidth="1" strokeOpacity="0.15" stroke="currentColor" />
          <line x1="80" y1="65" x2="95" y2="60" strokeWidth="1" strokeOpacity="0.15" stroke="currentColor" />
          <line x1="80" y1="70" x2="95" y2="70" strokeWidth="1" strokeOpacity="0.15" stroke="currentColor" />
          <line x1="80" y1="75" x2="95" y2="80" strokeWidth="1" strokeOpacity="0.15" stroke="currentColor" />
          {/* Paw print */}
          <circle cx="20" cy="110" r="5" fillOpacity="0.15" fill="currentColor" />
          <circle cx="30" cy="105" r="5" fillOpacity="0.15" fill="currentColor" />
          <circle cx="40" cy="110" r="5" fillOpacity="0.15" fill="currentColor" />
          <ellipse cx="30" cy="120" rx="8" ry="6" fillOpacity="0.15" fill="currentColor" />
          {/* Paw print 2 */}
          <circle cx="100" cy="20" r="5" fillOpacity="0.15" fill="currentColor" />
          <circle cx="110" cy="15" r="5" fillOpacity="0.15" fill="currentColor" />
          <circle cx="120" cy="20" r="5" fillOpacity="0.15" fill="currentColor" />
          <ellipse cx="110" cy="30" rx="8" ry="6" fillOpacity="0.15" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={darkMode ? "#0f1729" : "#fff8e9"} />
      <rect width="100%" height="100%" fill="url(#catPattern)" />

      {/* Moon for dark mode or sun for light mode */}
      {darkMode ? (
        <circle cx="650" cy="80" r="40" fill="#e2e8f0" fillOpacity="0.3" />
      ) : (
        <circle cx="650" cy="80" r="40" fill="#f97316" fillOpacity="0.3" />
      )}
    </svg>
  </div>
);

export default function TaskManager() {

  const navigate = useNavigate()

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    category: "general",
    subtasks: []
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const user_id = sessionStorage.getItem("user_id");

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      if (!localStorage.getItem("token") && !sessionStorage.getItem('token')) {
        navigate("/login");
      }
    };

    checkAuth();

    // Get all tasks only once when component mounts
    handleGetAllTaskByUserId();
  }, []); // Empty dependency array ensures this runs only once

  // Apply dark mode
  useEffect(() => {
    document.body.className = darkMode ? "bg-gray-950" : "bg-orange-50";
  }, [darkMode]);

  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setShowAddModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    // Clear all authentication tokens
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user_id");
    sessionStorage.removeItem("user_id");

    // Redirect to login page
    navigate("/login");
  };

  // Toggle subtask expansion
  const toggleExpand = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleGetAllTaskByUserId = async () => {
    try {
      setIsLoading(true);
      const res = await GetAllTaskByUserId(user_id);
      // Only set tasks if the response is valid and not empty
      if (res && Array.isArray(res)) {
        setTasks(res);
      }
    } catch (error) {
      console.error(error);
      showError(error.message || "Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  // Add new task
  const handleAddTask = async () => {
    const { title, description, status, priority, dueDate, category, subtasks } = newTask;
  
    if (
      title.trim() === "" ||
      description.trim() === "" ||
      status.trim() === "" ||
      priority.trim() === "" ||
      dueDate.trim() === "" ||
      category.trim() === ""
    ) {
      showError("Please fill in all required fields.");
      return;
    }
  
    const isValidDate = !isNaN(Date.parse(dueDate));
    if (!isValidDate) {
      showError("Invalid date");
      return;
    }
  
    if (!Array.isArray(subtasks)) {
      showError("Subtasks is not Arry");
      return;
    }
  
    const task = {
      ...newTask,
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
    };
  
    await handleCreateTask(task);
    await handleGetAllTaskByUserId();
  
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
      category: "general",
      subtasks: []
    });
  
    setShowAddModal(false);
  };
  

  // Reset form
  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
      category: "general",
      subtasks: []
    });
    setNewSubtask("");
  };

  // Add subtask to new task
  const addSubtaskToNewTask = () => {
    if (newSubtask.trim() === "") return;

    const subtask = {
      id: Date.now(),
      title: newSubtask,
      completed: false
    };

    setNewTask({
      ...newTask,
      subtasks: [...newTask.subtasks, subtask]
    });

    setNewSubtask("");
  };

  // updateTask function
  const updateTask = async (updatedData) => {
    await handleUpdateTask(updatedData)
    await handleGetAllTaskByUserId();
  };

  const handleUpdateTask = async (data) => {
    try {
      await UpdateTask(user_id, data)
    } catch (error) {
      console.log("handleUpdateTask", error)
      throw error
    }
  }

  // Remove subtask from new task
  const removeSubtaskFromNewTask = (subtaskId) => {
    setNewTask({
      ...newTask,
      subtasks: newTask.subtasks.filter(st => st.id !== subtaskId)
    });
  };

  // Add subtask to existing task
  const addSubtask = async (taskId, subtaskTitle) => {
    // if (subtaskTitle.trim() === "") return;

    // setTasks(tasks.map(task => {
    //   if (task.id === taskId) {
    //     const newSubtask = {
    //       id: Date.now(),
    //       title: subtaskTitle,
    //       completed: false
    //     };
    //     return {
    //       ...task,
    //       subtasks: [...task.subtasks, newSubtask]
    //     };
    //   }
    //   return task;
    // }));
    const data = {
      taskId,
      subtaskTitle
    }

    try {
      await CreateSubTask(user_id, data)
      await handleGetAllTaskByUserId()
    } catch (error) {
      console.error("addSubtask", error)
      throw error
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    console.log(taskId, subtaskId);
    let updatedSubtask = null;

    const updatedTasks = tasks.map(task => {
      const updatedSubtasks = task.subtasks.map(st => {
        if (st.id === subtaskId) {
          updatedSubtask = { ...st, completed: !st.completed };
          console.log("taskID", taskId);
          console.log("🔄 Updated Subtask:", updatedSubtask);
          return updatedSubtask;
        }
        return st;
      });

      return { ...task, subtasks: updatedSubtasks };
    });

    setTasks(updatedTasks);

    if (updatedSubtask) {
      await ToggleSubTask(taskId, updatedSubtask);
      await handleGetAllTaskByUserId()
    }
  };

  // Remove subtask
  const removeSubtask = async (taskId, subtaskId) => {
    try {
      await DeleteSubTask(user_id, subtaskId)
      await handleGetAllTaskByUserId()
    } catch (error) {
      console.error("removeSubtask", error)
      showError(error)
    }
  };

  // Toggle task status
  const toggleStatus = async (updatedData) => {
    // ลำดับการเปลี่ยนสถานะ
    const statusFlow = {
      "todo": "in-progress",
      "in-progress": "completed",
      "completed": "todo",
    };
  
    updatedData.status = statusFlow[updatedData.status] || "todo";
  
    try {
      await handleUpdateTask(updatedData);
      await handleGetAllTaskByUserId();
    } catch (error) {
      console.error(error);
    }
  };
  

  // Delete task
  const deleteTask = async (id) => {
    try {
      await DeleteTask(user_id, id)
      await handleGetAllTaskByUserId()
    } catch (error) {
      console.error("deleteTask", error)
      showError(error)
    }
  };

  // Filter tasks
  const filteredTasks = filter === "all"
    ? tasks
    : tasks.filter(task => task.status === filter);

  // Status themed names for filter buttons
  const statusNames = {
    "all": "all",
    "todo": "Todo",
    "in-progress": "In-progress",
    "completed": "Completed"
  };

  // Status icons for filter buttons
  const statusIcons = {
    "all": "😺",
    "todo": "😴",
    "in-progress": "🐱",
    "completed": "😪"
  };

  const handleCreateTask = async (data) => {
    try {
      await CreateTask(user_id, data)
    } catch (error) {
      console.error("handleCreateTask", error)
      throw error
    }
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-950 text-slate-200' : 'bg-orange-50 text-amber-950'}`}>
      {/* Cat Background SVG */}
      <CatBackground darkMode={darkMode} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className={`text-3xl font-bold ${darkMode ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-gradient-to-r from-orange-500 to-amber-600'} bg-clip-text text-transparent flex items-center`}>
            <span className="text-4xl mr-2">🐱</span> Cat Task Manager
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-all ${darkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-orange-100 text-amber-700 hover:bg-orange-200'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${darkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-slate-200 border border-gray-700'
                : 'bg-orange-100 hover:bg-orange-200 text-amber-700 border border-orange-200'
                }`}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Filter and Add Task */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className={`flex flex-wrap gap-2 p-1 rounded-lg backdrop-blur-sm ${darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-orange-100 bg-opacity-80'}`}>
            {Object.entries(statusNames).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${filter === key
                  ? darkMode
                    ? 'bg-gray-700 shadow-sm border border-gray-600'
                    : 'bg-white shadow-sm border border-orange-300'
                  : darkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-orange-200'
                  }`}
              >
                <span>{statusIcons[key]}</span> {value}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow transition-colors ${darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
          >
            <PlusCircle className="w-5 h-5" />
            Add Task
          </button>
        </div>

        {isLoading ? (
          <div className={`flex flex-col items-center justify-center p-8 rounded-lg border-2 backdrop-blur-sm ${darkMode
            ? 'bg-gray-800 bg-opacity-90 border-gray-700'
            : 'bg-white bg-opacity-90 border-orange-300'
            }`}>
            <div className="text-6xl mb-4 animate-pulse">😸</div>
            <h3 className="text-xl font-medium mb-2 text-center">Loading tasks...</h3>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className={`flex flex-col items-center justify-center p-8 rounded-lg border-2 backdrop-blur-sm ${darkMode
            ? 'bg-gray-800 bg-opacity-90 border-gray-700'
            : 'bg-white bg-opacity-90 border-orange-300'
            }`}>
            <div className="text-6xl mb-4">😿</div>
            <h3 className="text-xl font-medium mb-2 text-center">Not Found</h3>
            <p className={`text-center mb-4 ${darkMode ? 'text-slate-300' : 'text-gray-500'}`}>
              There are no new jobs in this category yet.
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className={`px-4 py-2 rounded-lg text-white ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-500 hover:bg-orange-600'
                }`}
            >
              Add Task
            </button>
          </div>
        ) : (
          // On mobile: show all tasks in one column
          // On medium screens and above: divide into 3 columns
          <>
            <div className="block md:hidden">
              {/* Mobile layout: single column */}
              <div className="flex flex-col gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    darkMode={darkMode}
                    toggleStatus={toggleStatus}
                    expandedTasks={expandedTasks}
                    toggleExpand={toggleExpand}
                    toggleSubtask={toggleSubtask}
                    removeSubtask={removeSubtask}
                    addSubtask={addSubtask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                  />
                ))}
              </div>
            </div>

            <div className="hidden md:flex gap-6">
              {/* Desktop layout: 3 columns */}
              {/* Column 1 */}
              <div className="flex-1 flex flex-col gap-4">
                {filteredTasks.filter((_, index) => index % 3 === 0).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    darkMode={darkMode}
                    toggleStatus={toggleStatus}
                    expandedTasks={expandedTasks}
                    toggleExpand={toggleExpand}
                    toggleSubtask={toggleSubtask}
                    removeSubtask={removeSubtask}
                    addSubtask={addSubtask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                  />
                ))}
              </div>

              {/* Column 2 */}
              <div className="flex-1 flex flex-col gap-4">
                {filteredTasks.filter((_, index) => index % 3 === 1).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    darkMode={darkMode}
                    toggleStatus={toggleStatus}
                    expandedTasks={expandedTasks}
                    toggleExpand={toggleExpand}
                    toggleSubtask={toggleSubtask}
                    removeSubtask={removeSubtask}
                    addSubtask={addSubtask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                  />
                ))}
              </div>

              {/* Column 3 */}
              <div className="flex-1 flex flex-col gap-4">
                {filteredTasks.filter((_, index) => index % 3 === 2).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    darkMode={darkMode}
                    toggleStatus={toggleStatus}
                    expandedTasks={expandedTasks}
                    toggleExpand={toggleExpand}
                    toggleSubtask={toggleSubtask}
                    removeSubtask={removeSubtask}
                    addSubtask={addSubtask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Cat-themed footer - Responsive */}
        <div className={`mt-8 text-center flex flex-wrap items-center justify-center gap-2 ${darkMode ? 'text-blue-300' : 'text-amber-700'}`}>
          <span>🐾</span>
          <span className="text-center">Copyrights © 2025 All rights reserved, Poochit Sakunthong.</span>
          <span>🐾</span>
        </div>
      </div>

      {/* Cat-themed Add Task Modal */}
      <CatTaskModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newTask={newTask}
        setNewTask={setNewTask}
        newSubtask={newSubtask}
        setNewSubtask={setNewSubtask}
        darkMode={darkMode}
        addSubtaskToNewTask={addSubtaskToNewTask}
        removeSubtaskFromNewTask={removeSubtaskFromNewTask}
        handleAddTask={handleAddTask}
        resetForm={resetForm}
      />
    </div>
  );
}