// src/config/exercises.ts

export type Exercise = {
  id: string;
  key: string;
  title: string;
  description: string;
  instructions: string;
  icon: string; // for Material Icons or emojis
};

export const exercises: Exercise[] = [
  {
    id: "pushups",
    key: "Push-ups",
    title: "Push-ups",
    description: "Perform as many push-ups as possible in 60 seconds.",
    instructions:
      "Keep your back straight, lower your chest to the ground, and push back up.",
    icon: "fitness_center",
  },
  {
    id: "squats",
    key: "Squats",
    title: "Squats",
    description: "Perform as many squats as possible in 60 seconds.",
    instructions:
      "Stand with feet shoulder-width apart, lower hips back and down, then return to standing.",
    icon: "directions_run",
  },
  {
    id: "situps",
    key: "Sit-ups",
    title: "Sit-ups",
    description: "Complete as many sit-ups as possible in 60 seconds.",
    instructions:
      "Lie on your back with knees bent, lift your upper body towards your knees, then lower back down.",
    icon: "self_improvement",
  },
  {
    id: "vertical_jump",
    key: "Vertical Jump",
    title: "Vertical Jump",
    description: "Measure your maximum jump height.",
    instructions:
      "Stand straight, bend knees, and jump as high as possible. Try to reach with your hand.",
    icon: "sports_handball",
  },
  {
    id: "long_jump",
    key: "Long Jump",
    title: "Long Jump",
    description: "Measure the longest distance you can jump forward.",
    instructions:
      "Stand behind a line, bend knees, swing arms, and jump forward with both feet together.",
    icon: "sports_kabaddi",
  },
];
