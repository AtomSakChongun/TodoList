import axios from 'axios';

const baseURL = 'http://localhost:3000/'

export const GetLogin = async (email,password) =>{
    try {
        const res = await axios.post(`${baseURL}api/user/login`,{email,password})
        console.log(res)
        return res.data
    } catch (error) {
        console.error("getLogin",error)
        throw error
    }
}

export const CreateUser = async (data) =>{
    try {
        const res = await axios.post(`${baseURL}api/user/createuser`,data)
        console.log(res)
        return res.data
    } catch (error) {
        console.error("CreateUser",error)
        throw error
    }
}