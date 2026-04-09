import { useState } from 'react'
import { Brain, Sun, Heart, Target, Users, Sparkles, ArrowRight } from 'lucide-react'

const dimensionCards = [
  { icon: Sun, name: "外向性", nameEn: "Extraversion", color: "from-amber-400 to-orange-500", bg: "bg-amber-50", text: "text-amber-700" },
  { icon: Heart, name: "神经质", nameEn: "Neuroticism", color: "from-red-400 to-rose-500", bg: "bg-red-50", text: "text-red-700" },
  { icon: Target, name: "严谨性", nameEn: "Conscientiousness", color: "from-blue-400 to-indigo-500", bg: "bg-blue-50", text: "text-blue-700" },
  { icon: Users, name: "宜人性", nameEn: "Agreeableness", color: "from-emerald-400 to-green-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  { icon: Sparkles, name: "开放性", nameEn: "Openness", color: "from-purple-400 to-violet-500", bg: "bg-purple-50", text: "text-purple-700" },
]

export default function IntroPage({ onStart }) {
  const [gender, setGender] = useState(null)
  const [showError, setShowError] = useState(false)

  const handleStart = () => {
    if (!gender) {
      setShowError(true)
      return
    }
    onStart(gender)
  }

  return (
    <div className="min-h-screen fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl -translate-y-1/2" />
        
        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/80 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              心理测量工具
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight pb-2">
              中国大五人格问卷
            </h1>
            <h2 className="text-xl sm:text-2xl font-medium text-slate-500 dark:text-slate-400 mt-3">
              简式版 (CBF-PI-B)
            </h2>
            
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              由王孟成博士和戴晓阳教授编制，共包含 <span className="font-semibold text-indigo-600 dark:text-indigo-400">40</span> 个条目，
              从五个核心维度全面评估您的人格特征，具有满意的信效度。
            </p>
          </div>
        </div>
      </div>

      {/* Dimension Cards */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <h3 className="text-center text-lg font-semibold text-slate-700 dark:text-slate-200 mb-6">五大人格维度</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {dimensionCards.map((dim, i) => (
            <div
              key={dim.name}
              className={`slide-up glass-card rounded-2xl p-4 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default`}
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${dim.color} text-white mb-3`}>
                <dim.icon className="w-5 h-5" />
              </div>
              <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{dim.name}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{dim.nameEn}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions & Start */}
      <div className="max-w-2xl mx-auto px-4 pb-20">
        <div className="glass-card rounded-2xl p-6 sm:p-8 slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">i</span>
            测验说明
          </h3>
          
          <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            <p>
              下面是一些描述人们性格特点的句子，请根据每个句子与您的性格相符程度进行评分。
            </p>
            <p>
              评分从 <span className="font-medium text-slate-800 dark:text-slate-100">1（完全不符合）</span> 到 <span className="font-medium text-slate-800 dark:text-slate-100">6（完全符合）</span>，
              每个人的性格各不相同，答案没有对错之分，请根据您的实际情况作答。
            </p>
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {[1,2,3,4,5,6].map(n => (
                <div key={n} className="flex items-center gap-1.5">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                    {n}
                  </span>
                  <span className="text-xs text-slate-500">
                    {n === 1 ? '完全不符合' : n === 6 ? '完全符合' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Selection */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
              请选择您的性别 <span className="text-red-400">*</span>
              <span className="font-normal text-slate-400 ml-2">（用于与常模进行比较）</span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => { setGender('male'); setShowError(false) }}
                className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                  gender === 'male'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-100'
                    : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-500'
                }`}
              >
                男性
              </button>
              <button
                onClick={() => { setGender('female'); setShowError(false) }}
                className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                  gender === 'female'
                    ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-md shadow-pink-100'
                    : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-pink-300 hover:text-pink-500'
                }`}
              >
                女性
              </button>
            </div>
            {showError && (
              <p className="mt-2 text-sm text-red-500 fade-in">请先选择您的性别</p>
            )}
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="mt-6 w-full py-4 px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold text-base
              hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 
              active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-200/50
              flex items-center justify-center gap-2 group"
          >
            开始测评
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
            共 40 题，预计用时 5-8 分钟
          </p>
        </div>

        {/* References */}
        <div className="mt-8 text-center text-xs text-slate-400 space-y-1">
          <p>王孟成, 戴晓阳, 姚树桥. (2011). 中国大五人格问卷的初步编制Ⅲ: 简式版的制定及信效度检验.</p>
          <p>中国临床心理学杂志, 18(4): 454-459.</p>
        </div>
      </div>
    </div>
  )
}
