import { useState, useCallback } from 'react'
import IntroPage from './components/IntroPage'
import Questionnaire from './components/Questionnaire'
import ResultsPage from './components/ResultsPage'

function App() {
  const [page, setPage] = useState('intro')
  const [gender, setGender] = useState(null)
  const [answers, setAnswers] = useState({})

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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen">
      {page === 'intro' && <IntroPage onStart={handleStart} />}
      {page === 'questionnaire' && (
        <Questionnaire onComplete={handleComplete} onBack={() => setPage('intro')} />
      )}
      {page === 'results' && (
        <ResultsPage answers={answers} gender={gender} onRestart={handleRestart} />
      )}
    </div>
  )
}

export default App
