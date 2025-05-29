import React from "react";
import { XCircle, Trash2 } from "lucide-react";

const CatTaskModal = ({
  showAddModal,
  setShowAddModal,
  newTask,
  setNewTask,
  newSubtask,
  setNewSubtask,
  darkMode,
  addSubtaskToNewTask,
  removeSubtaskFromNewTask,
  handleAddTask,
}) => {
  // Cat breed-themed category icons and names - same as TaskCard
  const categoryInfo = {
    design: { icon: "🐈‍", name: "Design" }, 
    report: { icon: "🐅", name: "Report" }, 
    meeting: { icon: "🦁", name: "Meeting" }, 
    development: { icon: "🐱", name: "Development" }, 
    general: { icon: "😻", name: "General" }
  };

  // Status themed names
  const statusNames = {
    "todo": "todo",
    "in-progress": "in-progress",
    "completed": "completed"
  };

  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className={`relative w-full max-w-2xl rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800 border-orange-700' : 'bg-white border-orange-300'} border-2`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cat ear decorations */}
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-orange-400 rounded-full transform rotate-45"></div>
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-orange-400 rounded-full transform -rotate-45"></div>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🐱</span>Add Task
          </h2>
          <button 
            onClick={() => setShowAddModal(false)}
            className="text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
          >
            <XCircle size={20} />
          </button>
        </div>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
          <div>
            <label className="block text-sm font-medium mb-1">Task Name<span className="text-orange-500">*</span></label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="w-full px-3 py-2 border border-orange-200 dark:border-orange-700 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-600"
              placeholder="Add name task..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="w-full px-3 py-2 border border-orange-200 dark:border-orange-700 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-600"
              placeholder="Add description.."
              rows="3"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                className="w-full px-3 py-2 border border-orange-200 dark:border-orange-700 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-600"
              >
                <option value="todo">{statusNames.todo}</option>
                <option value="in-progress">{statusNames["in-progress"]}</option>
                <option value="completed">{statusNames.completed}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="w-full px-3 py-2 border border-orange-200 dark:border-orange-700 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-600"
              >
                <option value="low">😸 Low</option>
                <option value="medium">😺 Medium</option>
                <option value="high">🙀 High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-orange-200 dark:border-orange-700 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-600"
                />
                <span className="absolute right-3 top-2 pointer-events-none">🐈</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={newTask.category}
              onChange={(e) => setNewTask({...newTask, category: e.target.value})}
              className="w-full px-3 py-2 border border-orange-200 dark:border-orange-700 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-600"
            >
              {Object.entries(categoryInfo).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.icon} {value.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Subtasks (renamed to ลูกแมว) */}
          <div>
            <label className="block text-sm font-medium mb-1">Sub Task</label>
            <div className="space-y-2 mb-3">
              {newTask.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-orange-50 dark:bg-gray-700 border border-orange-100 dark:border-orange-800 rounded-lg">
                    <span className="mr-2">🐾</span> {subtask.title}
                  </div>
                  <button 
                    onClick={() => removeSubtaskFromNewTask(subtask.id)}
                    className="text-gray-400 hover:text-orange-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                className="flex-1 px-3 py-2 border border-orange-200 dark:border-orange-700 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-600"
                placeholder="Add Task..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubtaskToNewTask();
                  }
                }}
              />
              <button
                onClick={addSubtaskToNewTask}
                className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setShowAddModal(false)}
            className="flex-1 px-4 py-2 border border-orange-300 dark:border-orange-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900 transition-colors"
          >
            Cancle
          </button>
          <button
            onClick={handleAddTask}
            disabled={newTask.title.trim() === ""}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              newTask.title.trim() === "" 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
           Add
          </button>
        </div>
        
        {/* Cat paw print decoration */}
        <div className="absolute -right-2 -bottom-2 text-4xl opacity-10 pointer-events-none">
          🐾
        </div>
      </div>
    </div>
  );
};

export default CatTaskModal;