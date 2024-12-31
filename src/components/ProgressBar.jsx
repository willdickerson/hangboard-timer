import React from 'react'
import PropTypes from 'prop-types'

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100

  return (
    <div className="w-full bg-gray-700/50 rounded-full h-2.5">
      <div
        className="bg-green-500 h-2.5 rounded-full transition-all duration-300 relative overflow-hidden"
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 animate-pulse" />
      </div>
    </div>
  )
}

ProgressBar.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
}

export default ProgressBar
