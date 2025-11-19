import './App.css'
import Dashboard1 from './admin_pages/Dashboard'
import Dashboard2 from './user_pages/Dashboard'
import Register from './authentication_pages/Register'
import { useState } from 'react'

function App() {
  const [isAdmin, setIsAdmin] = useState(true); 

  const Dashboard = isAdmin ? Dashboard2 : Dashboard1;
  return (
    <>
      <Register /> 
    </>
  )
}

export default App
