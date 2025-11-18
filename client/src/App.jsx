import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar.jsx'

function App() {

  return (
    <>
    <div className="flex">
      <Sidebar />
      <div className="w-screen">
        <Navbar />
      </div>
    </div>
    </>
  )
}

export default App
