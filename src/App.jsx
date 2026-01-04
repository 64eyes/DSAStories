import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Campaign from './pages/Campaign'
import Login from './pages/Login'
import ChapterPlay from './pages/ChapterPlay'
import Profile from './pages/Profile'
import Lobby from './pages/Lobby'
import Arena from './pages/Arena'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

const Leaderboard = () => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-6">
    <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
    <p className="mt-2 text-gray-300">
      Rankings placeholder. Show global, weekly, and nationality filters here.
    </p>
  </div>
)

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
          path="/arena/:roomId?"
          element={
            <ProtectedRoute>
              <Arena />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lobby"
          element={
            <ProtectedRoute>
              <Lobby />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/chapter/:chapterId" element={<ChapterPlay />} />
        <Route path="/campaign/:chapterId" element={<ChapterPlay />} />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <main className="mx-auto max-w-6xl px-4 pb-12 pt-24">
                <Leaderboard />
              </main>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      </div>
  )
}

export default App
