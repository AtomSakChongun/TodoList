// src/App.tsx

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TaskManager from './page/taskmanager/taskmanager_view'
import Login_View from './page/login/login_view'
import Register_View from './page/resgister/resgister_view'
import ForgotPassword_View from './page/forgotpassword/forgotpassword_view'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<TaskManager />} />
      <Route path="/login" element={<Login_View />} />
      <Route path='/resgister' element={<Register_View/>} />
      <Route path='/forgotpassword' element={<ForgotPassword_View/>} />
    </Routes>
  )
}

export default App
