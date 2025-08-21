import { Routes, Route } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import Home from './pages/Home'
import Register from './components/Register'
import Login from './components/Login'
import Menu from './components/Menu'
import ReservationHistory from './components/ReservationHistory'
import AdminPanel from './components/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import ReserveTable from './components/ReserveTable'

function App() {
  const { user } = useContext(AuthContext)

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/menu"
          element={<ProtectedRoute allowedRoles={['user', 'admin']}><Menu /></ProtectedRoute>}
        />
        <Route
          path="/reservations"
          element={<ProtectedRoute allowedRoles={['user']}><ReservationHistory /></ProtectedRoute>}
        />
        <Route
          path="/reserve"
          element={<ProtectedRoute allowedRoles={['user']}><ReserveTable /></ProtectedRoute>}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>}
        />
      </Routes>
    </div>
  )
}

export default App