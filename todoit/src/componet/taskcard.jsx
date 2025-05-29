import React, { useState, useCallback } from "react";
import { CheckCircle, Circle, Trash2, Calendar, PlusCircle, ChevronDown, ChevronUp, Edit, X, Save } from "lucide-react";

const TaskCard = ({
  task,
  darkMode,
  toggleStatus,
  expandedTasks,
  toggleExpand,
  toggleSubtask,
  removeSubtask,
  addSubtask,
  deleteTask,
  updateTask,
  updatePriority,
  updateCategory,
  updateStatus
}) => {

  const [isEditing, setIsEditing] = useState(false);
  const [isActionInProgress, setIsActionInProgress] = useState(false); // Flag for tracking action in progress

  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    category: task.category,
    dueDate: task.dueDate,
    status: task.status
  });

  const priorityColors = {
    high: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
  };

  // Priority icons (cat emotions)
  const priorityIcons = {
    high: "🙀", // shocked cat for high priority
    medium: "😺", // normal cat for medium priority
    low: "😸", // happy cat for low priority
  };

  // Priority labels in Thai
  const priorityLabels = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  // Cat breed-themed category icons and names - same as TaskCard
  const categoryInfo = {
    design: { icon: "🐈‍", name: "Design" },
    report: { icon: "🐅", name: "Report" },
    meeting: { icon: "🦁", name: "Meeting" },
    development: { icon: "🐱", name: "Development" },
    general: { icon: "😻", name: "General" }
  };

  // Status themed names and colors
  const statusInfo = {
    "todo": { name: "Todo", icon: "📝" },
    "in-progress": { name: "In Progress", icon: "🔄" },
    "completed": { name: "Completed", icon: "✅" }
  };
  
  // Calculate task progress
  const calculateProgress = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return 0;
    const completed = subtasks.filter(st => st.completed).length;
    return Math.round((completed / subtasks.length) * 100);
  };

  // Function to debounce actions with a specified delay
  const debounceAction = useCallback((action, ...args) => {
    if (isActionInProgress) return; // Prevent action if another is in progress
    
    setIsActionInProgress(true);
    
    // Perform the action
    action(...args);
    
    // Reset the flag after a delay (e.g., 500ms)
    setTimeout(() => {
      setIsActionInProgress(false);
    }, 500); // 500ms delay, adjust as needed
  }, [isActionInProgress]);

  // Function to cycle through priorities when clicked with debounce
  const cyclePriority = () => {
    debounceAction(() => {
      const priorities = ["high", "medium", "low"];
      const currentIndex = priorities.indexOf(task.priority);
      const nextIndex = (currentIndex + 1) % priorities.length;
      const newPriority = priorities[nextIndex];
      
      // Update task priority
      updatePriority(task.id, newPriority);
    });
  };

  // Function to cycle through categories when clicked with debounce
  const cycleCategory = () => {
    debounceAction(() => {
      const categories = ["design", "report", "meeting", "development", "general"];
      const currentIndex = categories.indexOf(task.category);
      const nextIndex = (currentIndex + 1) % categories.length;
      const newCategory = categories[nextIndex];
      
      // Update task category
      updateCategory(task.id, newCategory);
    });
  };

  // Function to cycle through statuses when clicked with debounce
  const cycleStatus = () => {
    debounceAction(() => {
      const statuses = ["todo", "in-progress", "completed"];
      const currentIndex = statuses.indexOf(task.status);
      const nextIndex = (currentIndex + 1) % statuses.length;
      const newStatus = statuses[nextIndex];
      
      // Update task status
      updateStatus(task.id, newStatus);
    });
  };

  // Debounced task status toggle
  const handleToggleStatus = () => {
    debounceAction(() => {
      toggleStatus(task);
    });
  };

  // Debounced subtask toggle
  const handleToggleSubtask = (taskId, subtaskId) => {
    debounceAction(() => {
      toggleSubtask(taskId, subtaskId);
    });
  };

  // Debounced expand toggle
  const handleToggleExpand = (taskId) => {
    debounceAction(() => {
      toggleExpand(taskId);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleSave = () => {
    console.log("handleSave",task)
    const data = editData
    data.id = task.id
    data.task_id = task.task_id
    debounceAction(() => {
      updateTask(data);
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate,
      status: task.status
    });
    setIsEditing(false);
  };

  // Status background colors for the status dropdown
  const statusBgColors = {
    "todo": "bg-gray-100 dark:bg-gray-700",
    "in-progress": "bg-blue-100 dark:bg-blue-700",
    "completed": "bg-green-100 dark:bg-green-700"
  };

  return (
    <div
      className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${darkMode ? 'bg-gray-800 border-purple-700 border-2' : 'bg-white border-purple-300 border-2'} relative flex flex-col w-full`}
    >
      <div className="p-5">
        {!isEditing ? (

          <>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <button 
                    onClick={cyclePriority}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]} hover:opacity-80 transition-opacity cursor-pointer ${isActionInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
                    title="Click to change priority"
                    disabled={isActionInProgress}
                  >
                    {priorityIcons[task.priority]} {priorityLabels[task.priority]}
                  </button>
                  <button
                    onClick={cycleCategory}
                    className={`inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${isActionInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
                    title="Click to change category"
                    disabled={isActionInProgress}
                  >
                    {categoryInfo[task.category].icon} {categoryInfo[task.category].name}
                  </button>
                </div>
                <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                  {task.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => !isActionInProgress && setIsEditing(true)}
                  className={`text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors ${isActionInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isActionInProgress}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={handleToggleStatus}
                  className={`flex-shrink-0 transition-colors ${task.status === 'completed' ? 'text-pink-500 hover:text-pink-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'} ${isActionInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isActionInProgress}
                >
                  {task.status === 'completed' ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {task.description}
            </p>
          </>
        ) : (

          <div className="mb-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-purple-600 dark:text-purple-400">Edit Task 🐱✏️</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="p-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={handleSave}
                  className={`p-1 bg-pink-500 hover:bg-pink-600 rounded-full ${isActionInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isActionInProgress}
                >
                  <Save className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name Task</label>
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-purple-200 dark:border-purple-700 rounded dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-purple-200 dark:border-purple-700 rounded dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={editData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-purple-200 dark:border-purple-700 rounded dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
                  >
                    <option value="high">High 🙀</option>
                    <option value="medium">Medium 😺</option>
                    <option value="low">Low 😸</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    name="category"
                    value={editData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-purple-200 dark:border-purple-700 rounded dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
                  >
                    <option value="design">Design 🐈‍</option>
                    <option value="report">Report 🐅</option>
                    <option value="meeting">Meeting 🦁</option>
                    <option value="development">Development 🐱</option>
                    <option value="general">General 😻</option>
                  </select>
                </div>
              </div>

              {/* Added Status Select Dropdown in Edit Form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  name="status"
                  value={editData.status}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border border-purple-200 dark:border-purple-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 ${statusBgColors[editData.status]}`}
                >
                  <option value="todo">Todo 📝</option>
                  <option value="in-progress">In Progress 🔄</option>
                  <option value="completed">Completed ✅</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={editData.dueDate ? new Date(editData.dueDate).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-purple-200 dark:border-purple-700 rounded dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
                />
              </div>
            </div>
          </div>
        )}


        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{calculateProgress(task.subtasks)}% {calculateProgress(task.subtasks) === 100 ? '😻' : '🐾'}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
            <div
              className="bg-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${calculateProgress(task.subtasks)}%` }}
            ></div>
            {calculateProgress(task.subtasks) >= 25 && (
              <span className="absolute left-1/4 top-0 transform -translate-x-1/2 text-xs">🐾</span>
            )}
            {calculateProgress(task.subtasks) >= 50 && (
              <span className="absolute left-1/2 top-0 transform -translate-x-1/2 text-xs">🐾</span>
            )}
            {calculateProgress(task.subtasks) >= 75 && (
              <span className="absolute left-3/4 top-0 transform -translate-x-1/2 text-xs">🐾</span>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="mb-3">
            <button
              onClick={() => handleToggleExpand(task.id)}
              className={`flex items-center justify-between w-full text-sm font-medium text-gray-600 dark:text-gray-300 px-2 py-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors ${isActionInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isActionInProgress}
            >
              <span>Sub Task ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})</span>
              {expandedTasks[task.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {expandedTasks[task.id] && (
              <div className="mt-2 space-y-2">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2 text-sm">
                    <button
                      onClick={() => handleToggleSubtask(task.task_id, subtask.id)}
                      className={`flex-shrink-0 transition-colors ${subtask.completed ? 'text-pink-500 hover:text-pink-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'} ${isActionInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={isActionInProgress}
                    >
                      {subtask.completed ? (
                        <span className="text-lg">🐱</span>
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                      {subtask.title}
                    </span>
                    <button
                      onClick={() => debounceAction(() => removeSubtask(task.id, subtask.id))}
                      className={`text-gray-400 hover:text-red-500 transition-colors ${isActionInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={isActionInProgress}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Add subtask inline with cat-themed placeholder */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    className="flex-1 px-2 py-1 text-sm border border-purple-200 dark:border-purple-700 rounded dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
                    placeholder="Add Task..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim() !== '' && !isActionInProgress) {
                        debounceAction(() => {
                          addSubtask(task.task_id, e.target.value);
                          e.target.value = '';
                        });
                      }
                    }}
                    disabled={isActionInProgress}
                  />
                  <button
                    onClick={(e) => {
                      if (isActionInProgress) return;
                      const input = e.currentTarget.previousSibling;
                      if (input.value.trim() !== '') {
                        debounceAction(() => {
                          addSubtask(task.task_id, input.value);
                          input.value = '';
                        });
                      }
                    }}
                    className={`p-1 bg-pink-500 hover:bg-pink-600 text-white rounded ${isActionInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isActionInProgress}
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!isEditing && (
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {task.dueDate ? `${new Date(task.dueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })} 🐈` : 'No due date 🐈‍⬛'}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={cycleStatus}
                className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full 
                  ${task.status === 'completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : task.status === 'in-progress' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  } hover:opacity-80 transition-opacity cursor-pointer ${isActionInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
                title="Click to change status"
                disabled={isActionInProgress}
              >
                {statusInfo[task.status].icon} {statusInfo[task.status].name}
              </button>
              <button
                onClick={() => debounceAction(() => deleteTask(task.id))}
                className={`text-gray-400 hover:text-red-500 transition-colors ${isActionInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isActionInProgress}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status indicator bar with cat-themed colors */}
      <div className={`h-1 w-full 
        ${task.status === 'completed'
          ? 'bg-pink-500'
          : task.status === 'in-progress'
            ? 'bg-purple-500'
            : 'bg-amber-500'}`
      }></div>

      {/* Cat paw print decoration */}
      <div className="absolute -right-2 -bottom-2 opacity-10 text-4xl rotate-12 pointer-events-none">
        🐾
      </div>
    </div>
  );
};

export default TaskCard;