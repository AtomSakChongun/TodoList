import axios from 'axios';

const baseURL = 'http://localhost:3000/'

export const GetAllTaskByUserId = async (id) => {
  try {
    const res = await axios.get(`${baseURL}api/task/gettaskbyuserid/${id}`)
    // console.log(res)
    return res.data
  } catch (error) {
    console.error("GetAllTaskByUserId", error)
    throw error
  }
}

export const CreateTask = async (id, data) => {
  try {
    await axios.post(`${baseURL}api/task/createbyuserid/${id}`, data);
  } catch (error) {
    console.log("CreateTask", error);
    throw error;
  }
};

export const UpdateTask = async (id, data) => {
  try {
    await axios.post(`${baseURL}api/task/updatebyid/${id}`, data)
  } catch (error) {
    console.error("UpdateTask", error)
    throw error
  }
}

export const ToggleSubTask = async (task_id, data) => {
  try {
    await axios.post(`${baseURL}api/task/togglesubtaskbytaskId/${task_id}`, data)
  } catch (error) {
    console.log("toggleSubTask", error)
    throw error
  }
}

export const DeleteTask = async (user_id, task_id) => {
  try {
    await axios.delete(`${baseURL}api/task/delete/task/${task_id}/user_id/${user_id}`)
  } catch (error) {
    console.log("DeleteTask", error)
    throw error
  }
}

export const DeleteSubTask = async (user_id, subtask_id) => {
  try {
    await axios.delete(`${baseURL}api/task/delete/subtask/${subtask_id}/user_id/${user_id}`)
  } catch (error) {
    console.log("DeleteTask", error)
    throw error
  }
}

export const CreateSubTask =async (user_id,data)=>{
  try {
    await axios.post(`${baseURL}api/task/createsubtaskbyuserid/${user_id}`, data)
  } catch (error) {
    console.error("CreateSubTask",error)
    throw error
  }
}