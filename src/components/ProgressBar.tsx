import React from 'react'

interface ProgressBarProps {
  current: number
  total: number
  isDark: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  isDark,
}) => {
  const percentage = (current / total) * 100

  return (
    <div
      className={`w-full ${isDark ? 'bg-gray-700/50' : 'bg-gray-300/50'} rounded-full h-2.5`}
    >
      <div
        className="bg-green-500 h-2.5 rounded-full transition-all duration-300 relative overflow-hidden"
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

export default ProgressBar
