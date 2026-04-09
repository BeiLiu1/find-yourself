import { useMemo, useRef, useState } from 'react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ReferenceLine, Legend
} from 'recharts'
import { Sun, Heart, Target, Users, Sparkles, RotateCcw, TrendingUp, TrendingDown, Minus, Download, Share2, Award } from 'lucide-react'
import { questions, dimensions, norms, personalityTypes, typeModifiers, zToPercentile } from '../data/questions'

const iconMap = { Sun, Heart, Target, Users, Sparkles }

function calculateScores(answers) {
  const scores = {}
  Object.keys(dimensions).forEach((dim) => { scores[dim] = 0 })
  questions.forEach((q) => {
    const raw = answers[q.id]
    if (raw === undefined) return
    scores[q.dimension] += q.isReverse ? 7 - raw : raw
  })
  return scores
}

function getLevel(score, mean, sd) {
  if (score >= mean + sd) return { level: '高', color: 'text-rose-600', bg: 'bg-rose-50', icon: TrendingUp }
  if (score >= mean + 0.5 * sd) return { level: '中偏高', color: 'text-amber-600', bg: 'bg-amber-50', icon: TrendingUp }
  if (score >= mean - 0.5 * sd) return { level: '中等', color: 'text-blue-600', bg: 'bg-blue-50', icon: Minus }
  if (score >= mean - sd) return { level: '中偏低', color: 'text-sky-600', bg: 'bg-sky-50', icon: TrendingDown }
  return { level: '低', color: 'text-teal-600', bg: 'bg-teal-50', icon: TrendingDown }
}

function getPersonalityType(scores, genderNorms) {
  const zScores = {}
  Object.keys(scores).forEach((key) => {
    zScores[key] = (scores[key] - genderNorms[key].mean) / genderNorms[key].sd
  })
  const sorted = Object.entries(zScores).sort((a, b) => b[1] - a[1])
  const primary = sorted[0][0]
  const secondary = sorted[1][0]
  const emoji = personalityTypes[primary].emoji
  const title = `${typeModifiers[secondary]}${personalityTypes[primary].label}`
  return { title, emoji, primary, secondary, zScores }
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-3 text-sm">
      <p className="font-semibold text-slate-800 dark:text-slate-100">{data.fullName}</p>
      <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">得分: {data.score}</p>
      <p className="text-slate-400 text-xs mt-0.5">常模均值: {data.normMean}</p>
    </div>
  )
}

export default function ResultsPage({ answers, gender, onRestart }) {
  const scores = useMemo(() => calculateScores(answers), [answers])
  const genderNorms = norms[gender] || norms.male
  const posterRef = useRef(null)
  const [saving, setSaving] = useState(false)

  const personalityInfo = useMemo(() => getPersonalityType(scores, genderNorms), [scores, genderNorms])

  const radarData = useMemo(() => {
    const order = ['E', 'O', 'A', 'C', 'N']
    return order.map((key) => ({
      dimension: dimensions[key].name,
      fullName: `${dimensions[key].name} (${dimensions[key].nameEn})`,
      score: scores[key],
      normMean: genderNorms[key].mean,
      fullMark: 48,
    }))
  }, [scores, genderNorms])

  const barData = useMemo(() => {
    const order = ['E', 'C', 'A', 'O', 'N']
    return order.map((key) => ({
      name: dimensions[key].name,
      您的得分: scores[key],
      常模均值: Math.round(genderNorms[key].mean * 10) / 10,
      color: dimensions[key].color,
    }))
  }, [scores, genderNorms])

  const dimOrder = ['E', 'C', 'A', 'O', 'N']

  const handleSavePoster = async () => {
    if (!posterRef.current) return
    setSaving(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      })
      const link = document.createElement('a')
      link.download = `大五人格测评结果_${new Date().toLocaleDateString('zh-CN')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error('Save failed:', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen pb-20 fade-in">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-4xl mx-auto px-4 pt-12 pb-8 sm:pt-16 sm:pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            测评结果
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
            您的大五人格画像
          </h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
            基于 CBF-PI-B 量表 · {gender === 'female' ? '女性' : '男性'}常模对照
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">

        {/* Personality Type Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 scale-in text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">您的人格类型</span>
            </div>
            <div className="text-5xl mb-3">{personalityInfo.emoji}</div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {personalityInfo.title}
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              主导维度: <span className="font-semibold" style={{ color: dimensions[personalityInfo.primary].color }}>{dimensions[personalityInfo.primary].name}</span>
              {' · '}辅助维度: <span className="font-semibold" style={{ color: dimensions[personalityInfo.secondary].color }}>{dimensions[personalityInfo.secondary].name}</span>
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
              {dimOrder.map((key) => {
                const pct = Math.round(zToPercentile(personalityInfo.zScores[key]))
                return (
                  <div key={key} className="text-center">
                    <div className="text-xs text-slate-400 dark:text-slate-500">{dimensions[key].name}</div>
                    <div className="text-lg font-bold" style={{ color: dimensions[key].color }}>P{pct}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="glass-card rounded-2xl p-4 sm:p-8 mb-6 scale-in">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 text-center">人格维度总览</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center mb-4">雷达图展示五大维度得分分布</p>
          
          <div className="radar-animate">
            <ResponsiveContainer width="100%" height={380}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" className="dark:opacity-30" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#475569', fontSize: 14, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 48]} tick={{ fill: '#94a3b8', fontSize: 10 }} tickCount={5} />
                <Radar name="常模均值" dataKey="normMean" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="6 4" />
                <Radar name="您的得分" dataKey="score" stroke="#6366f1" fill="url(#radarGradient)" fillOpacity={0.3} strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#fff' }} />
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

          <div className="flex items-center justify-center gap-6 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-indigo-500 rounded" />
              <span>您的得分</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 rounded" style={{ borderTop: '2px dashed #94a3b8', height: 0 }} />
              <span>常模均值</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Comparison */}
        <div className="glass-card rounded-2xl p-4 sm:p-8 mb-6 slide-up">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 text-center">维度得分对比</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center mb-4">您的得分 vs 常模均值</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f033" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 13 }} />
              <YAxis domain={[0, 48]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Bar dataKey="您的得分" radius={[6, 6, 0, 0]} barSize={28}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Bar>
              <Bar dataKey="常模均值" fill="#94a3b8" fillOpacity={0.4} radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dimension Details */}
        <div className="space-y-4">
          {dimOrder.map((key, idx) => {
            const dim = dimensions[key]
            const score = scores[key]
            const norm = genderNorms[key]
            const pct = (score / 48) * 100
            const normPct = (norm.mean / 48) * 100
            const zScore = (score - norm.mean) / norm.sd
            const percentile = Math.round(zToPercentile(zScore))
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
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: dim.colorLight }}>
                      <DimIcon className="w-5 h-5" style={{ color: dim.color }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">{dim.name}</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{dim.nameEn}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${levelInfo.bg} ${levelInfo.color}`}>
                      <LevelIcon className="w-3 h-3" />
                      {levelInfo.level}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: dim.color }}>{score}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">P{percentile}</div>
                    </div>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="relative mb-3">
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full score-bar-fill"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${dim.color}88, ${dim.color})` }}
                    />
                  </div>
                  <div className="absolute top-0 h-3 w-0.5 bg-slate-500 dark:bg-slate-300" style={{ left: `${normPct}%` }} title={`常模均值: ${norm.mean}`} />
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-slate-400">8</span>
                    <span className="text-[10px] text-slate-400">常模 M={norm.mean.toFixed(1)} SD={norm.sd.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-400">48</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">{dim.description}</p>
                <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isHigh ? dim.highDesc : dim.lowDesc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Score Summary Table */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 mt-6 slide-up">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">得分汇总</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th className="text-left py-2 text-slate-500 dark:text-slate-400 font-medium">维度</th>
                  <th className="text-center py-2 text-slate-500 dark:text-slate-400 font-medium">得分</th>
                  <th className="text-center py-2 text-slate-500 dark:text-slate-400 font-medium">百分位</th>
                  <th className="text-center py-2 text-slate-500 dark:text-slate-400 font-medium">常模M</th>
                  <th className="text-center py-2 text-slate-500 dark:text-slate-400 font-medium">水平</th>
                </tr>
              </thead>
              <tbody>
                {dimOrder.map((key) => {
                  const dim = dimensions[key]
                  const score = scores[key]
                  const norm = genderNorms[key]
                  const z = (score - norm.mean) / norm.sd
                  const percentile = Math.round(zToPercentile(z))
                  const levelInfo = getLevel(score, norm.mean, norm.sd)
                  return (
                    <tr key={key} className="border-b border-slate-50 dark:border-slate-800">
                      <td className="py-3 font-medium text-slate-700 dark:text-slate-300">
                        <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: dim.color }} />
                        {dim.name}
                      </td>
                      <td className="py-3 text-center font-bold" style={{ color: dim.color }}>{score}</td>
                      <td className="py-3 text-center text-slate-600 dark:text-slate-300">P{percentile}</td>
                      <td className="py-3 text-center text-slate-500 dark:text-slate-400">{norm.mean.toFixed(1)}</td>
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

        {/* Shareable Poster (hidden for capture) */}
        <div className="mt-6">
          <div
            ref={posterRef}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '32px',
              color: 'white',
            }}
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{personalityInfo.emoji}</div>
              <h2 className="text-2xl font-bold">{personalityInfo.title}</h2>
              <p className="text-white/70 text-sm mt-1">中国大五人格问卷简式版 (CBF-PI-B)</p>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {dimOrder.map((key) => {
                const dim = dimensions[key]
                const score = scores[key]
                const z = (score - genderNorms[key].mean) / genderNorms[key].sd
                const percentile = Math.round(zToPercentile(z))
                return (
                  <div key={key} className="text-center rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <div className="text-xs text-white/70">{dim.name}</div>
                    <div className="text-2xl font-bold mt-1">{score}</div>
                    <div className="text-xs text-white/50 mt-0.5">P{percentile}</div>
                  </div>
                )
              })}
            </div>
            <div className="text-center mt-4 text-white/40 text-xs">
              {new Date().toLocaleDateString('zh-CN')} · {gender === 'female' ? '女性' : '男性'}常模
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={handleSavePoster}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm
              hover:from-indigo-600 hover:to-purple-600 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {saving ? '生成中...' : '保存结果海报'}
          </button>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-sm
              hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 active:scale-[0.98] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            重新测评
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-lg mx-auto">
            本测评结果仅供参考，不构成心理诊断。如需专业心理评估，请咨询专业心理咨询师。
            量表版权归王孟成、戴晓阳、姚树桥所有。
          </p>
        </div>
      </div>
    </div>
  )
}
