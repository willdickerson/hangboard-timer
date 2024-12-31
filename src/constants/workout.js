export const WORKOUT_STEPS = [
  { name: 'Warm-up: Hang on Jug', duration: 10, sound: 'start' },
  { name: 'Warm-up: Rest', duration: 60, sound: 'rest' },
  { name: 'Warm-up: Hang on Jug', duration: 10, sound: 'start' },
  { name: 'Warm-up: Rest', duration: 60, sound: 'rest' },
  { name: 'Warm-up: 6 Pull-ups', duration: 20, sound: 'start' },
  { name: 'Warm-up: Rest', duration: 60, sound: 'rest' },
  { name: 'Warm-up: 6 Pull-ups', duration: 20, sound: 'start' },
  { name: 'Warm-up: Rest', duration: 60, sound: 'rest' },
  { name: 'Warm-up: Chisel Grip', duration: 10, sound: 'start' },
  { name: 'Warm-up: Rest', duration: 60, sound: 'rest' },
  { name: 'Warm-up: Half Crimp', duration: 10, sound: 'start' },
  { name: 'Warm-up: Rest', duration: 60, sound: 'rest' },
  { name: 'Warm-up: Three Finger Drag', duration: 10, sound: 'start' },
  { name: 'Warm-up: Rest', duration: 60, sound: 'rest' },
  { name: 'Warm-up: Half Crimp', duration: 10, sound: 'start' },
  { name: 'Main: Rest', duration: 120, sound: 'rest' },
  { name: 'Main: Chisel Grip', duration: 10, sound: 'start' },
  { name: 'Main: Rest', duration: 120, sound: 'rest' },
  { name: 'Main: Chisel Grip', duration: 10, sound: 'start' },
  { name: 'Main: Rest', duration: 120, sound: 'rest' },
  { name: 'Main: Chisel Grip', duration: 10, sound: 'start' },
  { name: 'Main: Rest', duration: 120, sound: 'rest' },
  { name: 'Main: Half Crimp', duration: 10, sound: 'start' },
  { name: 'Main: Rest', duration: 120, sound: 'rest' },
  { name: 'Main: Half Crimp', duration: 10, sound: 'start' },
  { name: 'Main: Rest', duration: 120, sound: 'rest' },
  { name: 'Main: Half Crimp', duration: 10, sound: 'start' },
  { name: 'Main: Rest', duration: 120, sound: 'rest' },
  { name: 'Main: Three Finger Drag', duration: 10, sound: 'start' },
  { name: 'Main: Rest', duration: 120, sound: 'rest' },
  { name: 'Main: Three Finger Drag', duration: 10, sound: 'start' },
  { name: 'Main: Rest', duration: 120, sound: 'rest' },
  { name: 'Main: Three Finger Drag', duration: 10, sound: 'start' },
  { name: 'Main: Rest', duration: 120, sound: 'rest' },
  { name: 'Main: 12 Pull-ups', duration: 40, sound: 'start' },
]

export const sounds = {
  begin: new Audio('sounds/begin.mp3'),
  start: new Audio('sounds/start.mp3'),
  rest: new Audio('sounds/stop.mp3'),
}

export const formatTime = seconds => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
