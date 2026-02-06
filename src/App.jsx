import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Campaign from './pages/Campaign'
import Arena from './pages/Arena'
import Lobby from './pages/Lobby'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <main className="mx-auto max-w-6xl px-4 pb-12 pt-24">
              <Home />
            </main>
          }
        />
        <Route
          path="/campaign"
          element={
            <main className="mx-auto max-w-6xl px-4 pb-12 pt-24">
              <Campaign />
            </main>
          }
        />
        <Route
          path="/campaign/:chapterId"
          element={
            <main className="mx-auto max-w-6xl px-4 pb-12 pt-24">
              <Campaign />
            </main>
          }
        />
        <Route path="/arena" element={<Arena />} />
        <Route
          path="/lobby"
          element={
            <ProtectedRoute>
              <Lobby />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <main className="mx-auto max-w-6xl px-4 pb-12 pt-24">
                <Profile />
              </main>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <main className="mx-auto max-w-6xl px-4 pb-12 pt-24">
              <Leaderboard />
            </main>
          }
        />
      </Routes>
    </div>
  )
}

export default App
