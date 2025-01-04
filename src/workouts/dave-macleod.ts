import type { Workout } from './types'

const steps = [
  { name: 'Warm-up: Hang on Jug', duration: 10, sound: 'hang' as const },
  { name: 'Warm-up: Rest', duration: 60, sound: 'rest' as const },
  { name: 'Warm-up: Hang on Jug', duration: 10, sound: 'hang' as const },
  { name: 'Warm-up: Rest', duration: 60, sound: 'rest' as const },
  { name: 'Warm-up: 6 Pull-ups', duration: 20, sound: 'hang' as const },
  { name: 'Warm-up: Rest', duration: 60, sound: 'rest' as const },
  { name: 'Warm-up: 6 Pull-ups', duration: 20, sound: 'hang' as const },
  { name: 'Warm-up: Rest', duration: 60, sound: 'rest' as const },
  { name: 'Warm-up: Chisel Grip', duration: 10, sound: 'hang' as const },
  { name: 'Warm-up: Rest', duration: 60, sound: 'rest' as const },
  { name: 'Warm-up: Half Crimp', duration: 10, sound: 'hang' as const },
  { name: 'Warm-up: Rest', duration: 60, sound: 'rest' as const },
  { name: 'Warm-up: Three Finger Drag', duration: 10, sound: 'hang' as const },
  { name: 'Warm-up: Rest', duration: 60, sound: 'rest' as const },
  { name: 'Warm-up: Half Crimp', duration: 10, sound: 'hang' as const },
  { name: 'Main: Rest', duration: 120, sound: 'rest' as const },
  { name: 'Main: Chisel Grip', duration: 10, sound: 'hang' as const },
  { name: 'Main: Rest', duration: 120, sound: 'rest' as const },
  { name: 'Main: Chisel Grip', duration: 10, sound: 'hang' as const },
  { name: 'Main: Rest', duration: 120, sound: 'rest' as const },
  { name: 'Main: Chisel Grip', duration: 10, sound: 'hang' as const },
  { name: 'Main: Rest', duration: 120, sound: 'rest' as const },
  { name: 'Main: Half Crimp', duration: 10, sound: 'hang' as const },
  { name: 'Main: Rest', duration: 120, sound: 'rest' as const },
  { name: 'Main: Half Crimp', duration: 10, sound: 'hang' as const },
  { name: 'Main: Rest', duration: 120, sound: 'rest' as const },
  { name: 'Main: Half Crimp', duration: 10, sound: 'hang' as const },
  { name: 'Main: Rest', duration: 120, sound: 'rest' as const },
  { name: 'Main: Three Finger Drag', duration: 10, sound: 'hang' as const },
  { name: 'Main: Rest', duration: 120, sound: 'rest' as const },
  { name: 'Main: Three Finger Drag', duration: 10, sound: 'hang' as const },
  { name: 'Main: Rest', duration: 120, sound: 'rest' as const },
  { name: 'Main: Three Finger Drag', duration: 10, sound: 'hang' as const },
  { name: 'Main: Rest', duration: 120, sound: 'rest' as const },
  { name: 'Main: 12 Pull-ups', duration: 40, sound: 'hang' as const },
]

const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0)

export const daveMacleodWorkout: Workout = {
  id: 'dave-macleod',
  name: "Dave's Routine",
  description: 'A 31-minute hangboard routine',
  duration: totalDuration,
  attribution: {
    name: "Dave MacLeod's",
    url: 'https://www.youtube.com/watch?v=PebF3NyEGPc',
  },
  steps,
}
