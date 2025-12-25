import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import ReactCountryFlag from 'react-country-flag'
import { useAuth } from '../contexts/AuthContext'
import { getUserProfile, updateUserProfile } from '../services/firebase'

// Comprehensive nationality flags list
// Using country codes for react-country-flag library
const NATIONALITIES = [
  { code: 'UN', name: 'Global', isGlobal: true },
  { code: 'NG', name: 'Nigeria' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'KE', name: 'Kenya' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'GH', name: 'Ghana' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'UG', name: 'Uganda' },
  { code: 'IN', name: 'India' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'KR', name: 'South Korea' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'IL', name: 'Israel' },
  { code: 'TR', name: 'Turkey' },
  { code: 'RU', name: 'Russia' },
  { code: 'PL', name: 'Poland' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'RO', name: 'Romania' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'PA', name: 'Panama' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'BB', name: 'Barbados' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'NP', name: 'Nepal' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'LA', name: 'Laos' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'AF', name: 'Afghanistan' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'JO', name: 'Jordan' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'SY', name: 'Syria' },
  { code: 'YE', name: 'Yemen' },
  { code: 'OM', name: 'Oman' },
  { code: 'QA', name: 'Qatar' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'MA', name: 'Morocco' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'LY', name: 'Libya' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SO', name: 'Somalia' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CD', name: 'DR Congo' },
  { code: 'CG', name: 'Congo' },
  { code: 'GA', name: 'Gabon' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'SN', name: 'Senegal' },
  { code: 'ML', name: 'Mali' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'NE', name: 'Niger' },
  { code: 'TD', name: 'Chad' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'AO', name: 'Angola' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
  { code: 'BW', name: 'Botswana' },
  { code: 'NA', name: 'Namibia' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'KM', name: 'Comoros' },
].sort((a, b) => a.name.localeCompare(b.name))

function Profile() {
  const { currentUser, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedNationality, setSelectedNationality] = useState('UN')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (authLoading) return

      if (!currentUser?.uid) {
        // Not logged in, redirect to login
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        const userProfile = await getUserProfile(currentUser.uid)
        setProfile(userProfile)
        setSelectedNationality(userProfile.nationality || 'UN')
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [currentUser, authLoading, navigate])

  const handleNationalityChange = async (nationality) => {
    if (!currentUser?.uid) return

    setSelectedNationality(nationality)
    setSaving(true)
    setSaveSuccess(false)

    try {
      await updateUserProfile(currentUser.uid, { nationality })
      setProfile((prev) => ({ ...prev, nationality }))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (error) {
      console.error('Failed to update nationality:', error)
      // Revert on error
      setSelectedNationality(profile?.nationality || 'UN')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-emerald-400" />
          <p className="text-sm text-neutral-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null // Will redirect in useEffect
  }

  const elo = profile?.elo || 1200
  const rank = profile?.rank || 'Novice'
  const problemsSolved = profile?.unlockedChapters?.length || 0

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-24">
        {/* Header */}
        <header className="mb-8">
          <button
            onClick={() => navigate('/campaign')}
            className="mb-4 flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            <span>Back to Campaign</span>
          </button>
          <h1 className="text-3xl font-bold text-white">Operative Profile</h1>
          <p className="mt-2 text-sm text-neutral-400">Identity and performance metrics</p>
        </header>

        {/* Two-Column Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Identity */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/30 p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">Identity</h2>

            {/* Avatar */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <img
                  src={currentUser.photoURL || '/default-avatar.png'}
                  alt={currentUser.displayName || 'User'}
                  className="h-32 w-32 rounded-full border-2 border-white/20 object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      currentUser.displayName || 'User',
                    )}&background=dc2626&color=fff&size=128`
                  }}
                />
              </div>
            </div>

            {/* Name */}
            <div className="mb-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <p className="text-xl font-semibold text-white">
                  {currentUser.displayName || 'Anonymous Operative'}
                </p>
                {selectedNationality && (
                  <div className="flex items-center">
                    {selectedNationality === 'UN' ? (
                      <span className="text-2xl" role="img" aria-label="Global">
                        🌍
                      </span>
                    ) : (
                      <ReactCountryFlag
                        countryCode={selectedNationality}
                        svg
                        style={{
                          width: '2rem',
                          height: '2rem',
                        }}
                        title={
                          NATIONALITIES.find((n) => n.code === selectedNationality)?.name || 'Country'
                        }
                      />
                    )}
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-neutral-400">{currentUser.email}</p>
              {selectedNationality && (
                <p className="mt-2 text-xs text-neutral-500">
                  {NATIONALITIES.find((n) => n.code === selectedNationality)?.name || 'Global'}
                </p>
              )}
            </div>

            {/* Nationality Selector */}
            <div>
              <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-neutral-400">
                Nationality
              </label>
              <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
                <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-6">
                  {NATIONALITIES.map((nat) => (
                    <button
                      key={nat.code}
                      onClick={() => handleNationalityChange(nat.code)}
                      disabled={saving}
                      className={`relative flex items-center justify-center rounded-lg border p-2.5 transition-all ${
                        selectedNationality === nat.code
                          ? 'border-red-600 bg-red-600/20 shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                          : 'border-white/10 bg-neutral-800/60 hover:border-white/20 hover:bg-neutral-800/80'
                      } ${saving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      title={nat.name}
                    >
                      {nat.isGlobal ? (
                        <span className="text-2xl" role="img" aria-label={nat.name}>
                          🌍
                        </span>
                      ) : (
                        <ReactCountryFlag
                          countryCode={nat.code}
                          svg
                          style={{
                            width: '2rem',
                            height: '2rem',
                          }}
                          title={nat.name}
                        />
                      )}
                      {selectedNationality === nat.code && (
                        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600">
                          <Save size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              {saveSuccess && (
                <p className="mt-3 text-center text-xs text-emerald-400">Nationality saved!</p>
              )}
              {saving && (
                <p className="mt-3 text-center text-xs text-neutral-400">Saving...</p>
              )}
            </div>
          </div>

          {/* Right Column - Stats (The Black Box) */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/30 p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">The Black Box</h2>

            <div className="space-y-4">
              {/* Elo Rating */}
              <div className="rounded-lg border border-white/10 bg-neutral-950/60 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Elo Rating
                </p>
                <p className="text-3xl font-bold text-red-600">{elo}</p>
                <p className="mt-1 text-xs text-neutral-500">Starting at 1200</p>
              </div>

              {/* Current Rank */}
              <div className="rounded-lg border border-white/10 bg-neutral-950/60 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Current Rank
                </p>
                <p className="text-2xl font-bold text-red-600">{rank}</p>
                <p className="mt-1 text-xs text-neutral-500">Based on performance</p>
              </div>

              {/* Problems Solved */}
              <div className="rounded-lg border border-white/10 bg-neutral-950/60 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Problems Solved
                </p>
                <p className="text-3xl font-bold text-red-600">{problemsSolved}</p>
                <p className="mt-1 text-xs text-neutral-500">Chapters completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

