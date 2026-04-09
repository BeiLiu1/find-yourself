import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react'
import { questions, likertLabels } from '../data/questions'

const ITEMS_PER_PAGE = 8
const TOTAL_PAGES = Math.ceil(questions.length / ITEMS_PER_PAGE)

const scaleColors = [
  'from-blue-400 to-blue-500',
  'from-sky-400 to-cyan-500',
  'from-teal-400 to-emerald-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
  'from-purple-500 to-indigo-600',
]

const scaleBorderColors = [
  'border-blue-300 hover:border-blue-400',
  'border-sky-300 hover:border-sky-400',
  'border-teal-300 hover:border-teal-400',
  'border-amber-300 hover:border-amber-400',
  'border-rose-300 hover:border-rose-400',
  'border-purple-300 hover:border-purple-400',
]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Questionnaire({ onComplete, onBack, savedAnswers, onAnswersChange }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState(savedAnswers || {})
  const [shake, setShake] = useState(false)
  const [popId, setPopId] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const containerRef = useRef(null)
  const startTime = useRef(Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const pageQuestions = questions.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  )

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100

  const allPageAnswered = pageQuestions.every((q) => answers[q.id] !== undefined)
  const allAnswered = questions.every((q) => answers[q.id] !== undefined)

  const handleAnswer = (questionId, value) => {
    const next = { ...answers, [questionId]: value }
    setAnswers(next)
    onAnswersChange?.(next)
    setPopId(questionId)
    setTimeout(() => setPopId(null), 400)
  }

  const handleNext = () => {
    if (!allPageAnswered) {
      setShake(true)
      setTimeout(() => setShake(false), 600)
      return
    }
    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage((p) => p + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      onBack()
    }
  }

  const handleSubmit = () => {
    if (!allAnswered) {
      setShake(true)
      setTimeout(() => setShake(false), 600)
      return
    }
    onComplete(answers)
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Sticky Progress Header */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              第 {currentPage + 1} / {TOTAL_PAGES} 页
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                <Clock className="w-3.5 h-3.5 timer-pulse" />
                {formatTime(elapsed)}
              </span>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {answeredCount} / {questions.length}
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div ref={containerRef} className="max-w-3xl mx-auto px-4 pt-6">
        <div className="space-y-4">
          {pageQuestions.map((question, idx) => {
            const globalIdx = currentPage * ITEMS_PER_PAGE + idx
            const isAnswered = answers[question.id] !== undefined
            const unanswered = !isAnswered && shake
            const isPop = popId === question.id

            return (
              <div
                key={question.id}
                className={`glass-card rounded-2xl p-5 sm:p-6 transition-all duration-300 slide-up ${
                  unanswered ? 'ring-2 ring-red-300 animate-[shake_0.5s_ease-in-out]' : ''
                } ${isAnswered ? 'ring-1 ring-emerald-200 dark:ring-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10' : ''}
                ${isPop ? 'answer-pop' : ''}`}
                style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: 'both' }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    isAnswered
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {globalIdx + 1}
                  </span>
                  <p className="text-base text-slate-800 dark:text-slate-100 leading-relaxed pt-1 font-medium">
                    {question.text}
                  </p>
                  {isAnswered && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1.5 ml-auto" />
                  )}
                </div>

                {/* Likert Scale */}
                <div className="flex items-center justify-between gap-1 sm:gap-2">
                  {likertLabels.map((item, i) => {
                    const isSelected = answers[question.id] === item.value
                    return (
                      <button
                        key={item.value}
                        onClick={() => handleAnswer(question.id, item.value)}
                        className={`likert-btn flex-1 flex flex-col items-center gap-1.5 py-2 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? `bg-gradient-to-br ${scaleColors[i]} text-white border-transparent shadow-lg selected`
                            : `bg-white ${scaleBorderColors[i]} text-slate-600 hover:bg-slate-50`
                        }`}
                      >
                        <span className={`text-base sm:text-lg font-bold ${isSelected ? 'text-white' : ''}`}>
                          {item.value}
                        </span>
                        <span className={`text-[10px] sm:text-xs leading-tight hidden sm:block ${
                          isSelected ? 'text-white/90' : 'text-slate-400'
                        }`}>
                          {item.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {/* Mobile labels */}
                <div className="flex justify-between mt-2 sm:hidden">
                  <span className="text-[10px] text-slate-400">完全不符合</span>
                  <span className="text-[10px] text-slate-400">完全符合</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-sm
              hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            {currentPage === 0 ? '返回' : '上一页'}
          </button>

          <div className="flex-1" />

          {currentPage < TOTAL_PAGES - 1 ? (
            <button
              onClick={handleNext}
              className={`flex items-center gap-1 px-6 py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98] ${
                allPageAnswered
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 hover:from-indigo-600 hover:to-purple-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              下一页
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] ${
                allAnswered
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 hover:from-emerald-600 hover:to-teal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              提交并查看结果
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
