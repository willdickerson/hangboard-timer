import React, { useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'

interface ConfettiProps {
  active: boolean
}

const COLORS = [
  '#22c55e', // green-500
  '#16a34a', // green-600
  '#15803d', // green-700
  '#34d399', // emerald-400
  '#10b981', // emerald-500
  '#059669', // emerald-600
]

const Confetti: React.FC<ConfettiProps> = ({ active }) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{ opacity: active ? 1 : 0 }}
    >
      <ReactConfetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.3}
        initialVelocityY={20}
        tweenDuration={4000}
        run={active}
        colors={COLORS}
      />
    </div>
  )
}

export default Confetti
