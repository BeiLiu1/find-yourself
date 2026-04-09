import { useState, useCallback, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import IntroPage from './components/IntroPage'
import Questionnaire from './components/Questionnaire'
import ResultsPage from './components/ResultsPage'

const STORAGE_KEY = 'cbf-pi-b-state'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

function App() {
  const saved = loadState()
  const [page, setPage] = useState(saved?.page || 'intro')
  const [gender, setGender] = useState(saved?.gender || null)
  const [answers, setAnswers] = useState(saved?.answers || {})
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem('cbf-theme')
      if (stored) return stored === 'dark'
    } catch {}
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('cbf-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    if (page !== 'intro') {
      saveState({ page, gender, answers })
    }
  }, [page, gender, answers])

  const handleStart = useCallback((selectedGender) => {
    setGender(selectedGender)
    setAnswers({})
    setPage('questionnaire')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleComplete = useCallback((finalAnswers) => {
    setAnswers(finalAnswers)
    setPage('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleRestart = useCallback(() => {
    setPage('intro')
    setGender(null)
    setAnswers({})
    clearState()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen">
      {/* Dark mode toggle */}
      <button
        onClick={() => setDark((d) => !d)}
        className="fixed top-4 right-4 z-[100] w-10 h-10 rounded-full flex items-center justify-center
          bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700
          shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200
          text-slate-600 dark:text-amber-400"
        title={dark ? '切换亮色模式' : '切换暗黑模式'}
      >
        {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {page === 'intro' && <IntroPage onStart={handleStart} />}
      {page === 'questionnaire' && (
        <Questionnaire
          onComplete={handleComplete}
          onBack={() => { setPage('intro'); clearState() }}
          savedAnswers={answers}
          onAnswersChange={setAnswers}
        />
      )}
      {page === 'results' && (
        <ResultsPage answers={answers} gender={gender} onRestart={handleRestart} />
      )}
    </div>
  )
}

export default App
