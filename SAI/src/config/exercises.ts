// src/config/exercises.ts

export type Exercise = {
  id: string;
  key: string;
  title: string;
  description: string;
  instructions: string;
  icon: string; // for Material Icons or emojis
  tutorialVideo?: string; // optional link to a tutorial video
};

export const exercises: Exercise[] = [
  {
    id: "1",
key: "sit_and_reach",
title: "Sit and Reach",
description: "The Sit and Reach test measures the flexibility of your lower back and hamstring muscles. It’s a simple yet effective way to assess your overall flexibility and range of motion.",
instructions:
  "1. Sit on the floor with your legs fully extended and feet flat against a box or a straight surface.\n2. Keep your knees flat on the ground and place one hand on top of the other.\n3. Slowly reach forward as far as you can, sliding your hands along the measuring line.\n4. Hold the furthest position for 2 seconds without bouncing.\n5. Return to the starting position and repeat if needed. Record your best reach.",
icon: "fitness_center",
tutorialVideo: "https://www.youtube.com/watch?v=CKA2Dekxcjg&pp=ygUNc2l0IGFuZCByZWFjaNIHCQnrCQGHKiGM7w%3D%3D",

  },
  {
   id: "2",
key: "standing_vertical_jump",
title: "Standing Vertical Jump",
description: "The Standing Vertical Jump test measures your lower-body power and explosive strength. It helps assess athletic performance and leg muscle strength.",
instructions:
  "1. Stand with your feet shoulder-width apart next to a wall or a marked vertical measuring area.\n2. Reach up with one arm and mark your highest standing reach point.\n3. Swing your arms and bend your knees slightly to build momentum.\n4. Jump straight up as high as you can, touching or marking the wall at your highest point.\n5. Land softly with knees slightly bent to absorb impact.\n6. Measure the difference between your jump mark and standing reach to determine your vertical jump height.",
icon: "directions_run",
tutorialVideo: "https://www.youtube.com/watch?v=j260zYfRz8Q&pp=ygUWc3RhbmRpbmcgdmVydGljYWwganVtcA%3D%3D",

  },
  {
   id: "3",
key: "standing_broad_jump",
title: "Standing Broad Jump",
description: "The Standing Broad Jump test measures your leg strength and explosive power by assessing how far you can jump forward from a standing position. It’s a great indicator of lower-body power and coordination.",
instructions:
  "1. Stand behind a marked starting line with your feet shoulder-width apart.\n2. Swing your arms backward and bend your knees to build momentum.\n3. Jump forward as far as you can, swinging your arms forward and extending your legs during the jump.\n4. Land on both feet with your knees slightly bent to absorb impact.\n5. Keep your balance and avoid stepping backward after landing.\n6. Measure the distance from the starting line to the back of your heels to determine your jump length.",
icon: "self_improvement",
tutorialVideo: "https://www.youtube.com/watch?v=uhz-ia-2UcM&pp=ygUTc3RhbmRpbmcgYnJvYWQganVtcA%3D%3D",

    
  },
  {
    id: "4",
key: "30mts_standing_start",
title: "30 Meters Standing Start",
description: "The 30 Meters Standing Start test measures your sprinting speed and acceleration from a stationary position. It’s commonly used to assess explosive speed and running performance.",
instructions:
  "1. Stand behind the starting line with your feet shoulder-width apart in a comfortable sprint stance.\n2. Keep your knees slightly bent and lean your body slightly forward.\n3. On the signal, sprint forward as fast as possible for 30 meters.\n4. Focus on a quick and powerful start — drive with your legs and pump your arms.\n5. Run through the finish line without slowing down before the end.\n6. Record the time taken to cover the 30 meters for accurate measurement.",
icon: "sports_handball",
tutorialVideo: "https://www.youtube.com/watch?v=tsEbtILaCRI&pp=ygUaMzAgbWV0ZXIgZmx5aW5nIHN0YXJ0IHRlc3Q%3D",

  },
  {
   id: "5",
key: "4x10mts_shuttle_run",
title: "4×10 Meters Shuttle Run",
description: "The 4×10 Meters Shuttle Run test measures your speed, agility, and ability to change direction quickly. It’s a common fitness test used to assess coordination, acceleration, and quickness.",
instructions:
  "1. Set up two parallel lines 10 meters apart.\n2. Start behind one line in a ready sprint position.\n3. On the signal, sprint to the opposite line, touch the line with your hand, and sprint back to the start.\n4. Repeat this back-and-forth run for a total of four 10-meter segments (two round trips).\n5. Focus on quick turns and maintaining speed throughout the run.\n6. Record the total time taken to complete the 4×10 meters distance.",
icon: "sports_kabaddi",
tutorialVideo: "https://www.youtube.com/watch?v=9pb6JX2ulDU&pp=ygUSNCoxMCBtIHNodXR0bGUgcnVu",

  },
  {
    id: "6",
key: "sit_ups",
title: "Sit-Ups",
description: "The Sit-Up test measures your core strength and abdominal endurance by counting how many sit-ups you can complete in a fixed time period. It’s a simple and effective way to assess overall core fitness.",
instructions:
  "1. Lie on your back with your knees bent and feet flat on the ground, hip-width apart.\n2. Cross your arms over your chest or place your hands lightly behind your ears (without pulling your neck).\n3. Engage your core and lift your upper body toward your knees until your elbows touch your thighs or you reach a full upright position.\n4. Slowly lower your upper body back down until your shoulder blades touch the ground.\n5. Repeat the movement in a controlled manner for the set time period (e.g., 60 seconds).\n6. Count the total number of correct sit-ups completed.",
icon: "fitness_center",
tutorialVideo: "https://www.youtube.com/watch?v=pCX65Mtc_Kk&pp=ygUGc2l0dXBz",

  },
];