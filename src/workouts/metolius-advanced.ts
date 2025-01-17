import type { Workout } from '../types/workout'
import { calculateWorkoutDuration } from '../utils/time'

const steps = [
  {
    name: 'Large Slope: 20s straight arm hang',
    duration: 20,
    sound: 'hang' as const,
  },
  { name: '4-Finger Edge: 3 pull-ups', duration: 15, sound: 'hang' as const },
  { name: 'Rest', duration: 25, sound: 'rest' as const },
  {
    name: 'Large Slope: 20s bent arm hang',
    duration: 20,
    sound: 'hang' as const,
  },
  { name: 'L-sit or knee curls: 20s', duration: 20, sound: 'hang' as const },
  { name: 'Rest', duration: 20, sound: 'rest' as const },
  { name: '3-Finger Pocket: 5 pull-ups', duration: 25, sound: 'hang' as const },
  { name: 'Straight arm hang: 25s', duration: 25, sound: 'hang' as const },
  { name: 'Rest', duration: 10, sound: 'rest' as const },
  {
    name: 'Progression Hangs: 5s each hold',
    duration: 40,
    sound: 'hang' as const,
  },
  { name: 'Large Slope: 20s finish', duration: 20, sound: 'hang' as const },
  {
    name: 'Four-Finger Edge: Single arm hangs',
    duration: 40,
    sound: 'hang' as const,
  },
  { name: 'Rest', duration: 20, sound: 'rest' as const },
  {
    name: 'Large Slope/3-Finger: Offset pulls',
    duration: 30,
    sound: 'hang' as const,
  },
  { name: 'Switch and repeat', duration: 30, sound: 'hang' as const },
  { name: 'Four-Finger Edge: 90° hang', duration: 30, sound: 'hang' as const },
  {
    name: '3-Finger Pocket: 15s straight hang',
    duration: 15,
    sound: 'hang' as const,
  },
  { name: 'Rest', duration: 15, sound: 'rest' as const },
  { name: 'L-sit pull-ups: 3 reps', duration: 20, sound: 'hang' as const },
  {
    name: 'Large Slope: Lever or 15s hang',
    duration: 15,
    sound: 'hang' as const,
  },
  { name: 'Rest', duration: 25, sound: 'rest' as const },
  { name: '2-Finger Pockets: 20s hang', duration: 20, sound: 'hang' as const },
  { name: 'Power pull-ups: 3 reps', duration: 20, sound: 'hang' as const },
  { name: 'Rest', duration: 20, sound: 'rest' as const },
  {
    name: 'Large Slope: Max bent arm hang',
    duration: 30,
    sound: 'hang' as const,
  },
  {
    name: 'Large Slope: Max straight hang',
    duration: 30,
    sound: 'hang' as const,
  },
]

export const metoliusAdvancedWorkout: Workout = {
  id: 'metolius-advanced',
  name: 'Metolius Advanced',
  description: '10-minute advanced hangboard sequence',
  duration: calculateWorkoutDuration(steps),
  attribution: {
    name: 'Metolius',
    url: 'https://www.metoliusclimbing.com/training_guide_10_min.html',
  },
  steps,
}
