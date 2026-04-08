import { useMemo } from 'react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip
} from 'recharts'
import { Sun, Heart, Target, Users, Sparkles, RotateCcw, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { questions, dimensions, norms } from '../data/questions'

const iconMap = { Sun, Heart, Target, Users, Sparkles }

function calculateScores(answers) {
  const scores = {}
  Object.keys(dimensions).forEach((dim) => {
    scores[dim] = 0
  })

  questions.forEach((q) => {
    const raw = answers[q.id]
    if (raw === undefined) return
    const score = q.isReverse ? 7 - raw : raw
    scores[q.dimension] += score
  })

  return scores
}

function getLevel(score, mean, sd) {
  if (score >= mean + sd) return { level: '高', levelEn: 'High', color: 'text-rose-600', bg: 'bg-rose-50', icon: TrendingUp }
  if (score >= mean + 0.5 * sd) return { level: '中偏高', levelEn: 'Above Avg', color: 'text-amber-600', bg: 'bg-amber-50', icon: TrendingUp }
  if (score >= mean - 0.5 * sd) return { level: '中等', levelEn: 'Average', color: 'text-blue-600', bg: 'bg-blue-50', icon: Minus }
  if (score >= mean - sd) return { level: '中偏低', levelEn: 'Below Avg', color: 'text-sky-600', bg: 'bg-sky-50', icon: TrendingDown }
  return { level: '低', levelEn: 'Low', color: 'text-teal-600', bg: 'bg-teal-50', icon: TrendingDown }
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-100 p-3 text-sm">
      <p className="font-semibold text-slate-800">{data.fullName}</p>
      <p className="text-indigo-600 font-bold mt-1">得分: {data.score}</p>
      <p className="text-slate-400 text-xs mt-0.5">常模均值: {data.normMean}</p>
    </div>
  )
}

export default function ResultsPage({ answers, gender, onRestart }) {
  const scores = useMemo(() => calculateScores(answers), [answers])
  const genderNorms = norms[gender] || norms.male

  const radarData = useMemo(() => {
    const dimOrder = ['E', 'O', 'A', 'C', 'N']
    return dimOrder.map((key) => ({
      dimension: dimensions[key].name,
      fullName: `${dimensions[key].name} (${dimensions[key].nameEn})`,
      score: scores[key],
      normMean: genderNorms[key].mean,
      fullMark: 48,
    }))
  }, [scores, genderNorms])

  const dimOrder = ['E', 'C', 'A', 'O', 'N']

  return (
    <div className="min-h-screen pb-20 fade-in">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-4xl mx-auto px-4 pt-12 pb-8 sm:pt-16 sm:pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 text-emerald-700 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            测评结果
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-800">
            您的大五人格画像
          </h1>
          <p className="mt-3 text-slate-500 text-sm">
            基于 CBF-PI-B 量表 · {gender === 'female' ? '女性' : '男性'}常模对照
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Radar Chart */}
        <div className="glass-card rounded-2xl p-4 sm:p-8 mb-6 scale-in">
          <h3 className="text-lg font-semibold text-slate-800 mb-2 text-center">人格维度总览</h3>
          <p className="text-sm text-slate-400 text-center mb-4">雷达图展示五大维度得分分布</p>
          
          <div className="radar-animate">
            <ResponsiveContainer width="100%" height={380}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#475569', fontSize: 14, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 48]}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickCount={5}
                />
                <Radar
                  name="常模均值"
                  dataKey="normMean"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.1}
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                />
                <Radar
                  name="您的得分"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="url(#radarGradient)"
                  fillOpacity={0.3}
                  strokeWidth={2.5}
                  dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#fff' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-indigo-500 rounded" />
              <span>您的得分</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-slate-400 rounded border-dashed" style={{ borderTop: '2px dashed #94a3b8', height: 0 }} />
              <span>常模均值</span>
            </div>
          </div>
        </div>

        {/* Dimension Details */}
        <div className="space-y-4">
          {dimOrder.map((key, idx) => {
            const dim = dimensions[key]
            const score = scores[key]
            const norm = genderNorms[key]
            const pct = (score / 48) * 100
            const normPct = (norm.mean / 48) * 100
            const levelInfo = getLevel(score, norm.mean, norm.sd)
            const LevelIcon = levelInfo.icon
            const DimIcon = iconMap[dim.icon]
            const isHigh = score >= norm.mean

            return (
              <div
                key={key}
                className="glass-card rounded-2xl p-5 sm:p-6 slide-up"
                style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: dim.colorLight }}
                    >
                      <DimIcon className="w-5 h-5" style={{ color: dim.color }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{dim.name}</h4>
                      <p className="text-xs text-slate-400">{dim.nameEn}</p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${levelInfo.bg} ${levelInfo.color}`}>
                      <LevelIcon className="w-3 h-3" />
                      {levelInfo.level}
                    </div>
                    <div className="text-2xl font-bold" style={{ color: dim.color }}>
                      {score}
                    </div>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="relative mb-3">
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full score-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${dim.color}88, ${dim.color})`,
                      }}
                    />
                  </div>
                  {/* Norm marker */}
                  <div
                    className="absolute top-0 h-3 w-0.5 bg-slate-500"
                    style={{ left: `${normPct}%` }}
                    title={`常模均值: ${norm.mean}`}
                  />
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-slate-400">8</span>
                    <span className="text-[10px] text-slate-400">
                      常模 M={norm.mean.toFixed(1)} SD={norm.sd.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400">48</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed mb-2">{dim.description}</p>
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {isHigh ? dim.highDesc : dim.lowDesc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Score Summary Table */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 mt-6 slide-up">
          <h3 className="font-semibold text-slate-800 mb-4">得分汇总</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 text-slate-500 font-medium">维度</th>
                  <th className="text-center py-2 text-slate-500 font-medium">您的得分</th>
                  <th className="text-center py-2 text-slate-500 font-medium">常模均值</th>
                  <th className="text-center py-2 text-slate-500 font-medium">常模标准差</th>
                  <th className="text-center py-2 text-slate-500 font-medium">水平</th>
                </tr>
              </thead>
              <tbody>
                {dimOrder.map((key) => {
                  const dim = dimensions[key]
                  const score = scores[key]
                  const norm = genderNorms[key]
                  const levelInfo = getLevel(score, norm.mean, norm.sd)
                  return (
                    <tr key={key} className="border-b border-slate-50">
                      <td className="py-3 font-medium text-slate-700">
                        <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: dim.color }} />
                        {dim.name}
                      </td>
                      <td className="py-3 text-center font-bold" style={{ color: dim.color }}>{score}</td>
                      <td className="py-3 text-center text-slate-500">{norm.mean.toFixed(1)}</td>
                      <td className="py-3 text-center text-slate-500">{norm.sd.toFixed(1)}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${levelInfo.bg} ${levelInfo.color}`}>
                          {levelInfo.level}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer & Restart */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 mb-6 max-w-lg mx-auto">
            本测评结果仅供参考，不构成心理诊断。如需专业心理评估，请咨询专业心理咨询师。
            量表版权归王孟成、戴晓阳、姚树桥所有。
          </p>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium text-sm
              hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 active:scale-[0.98] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            重新测评
          </button>
        </div>
      </div>
    </div>
  )
}
