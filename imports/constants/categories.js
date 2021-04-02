
export const FITNESS = {
  name: 'fitness',
  readable: 'Fitness',
  imageSrc: '/images/workout-m2.jpg'
};
export const YOGA = {
  name: 'yoga',
  readable: 'Yoga',
  imageSrc: '/images/yoga-f1.jpg'
};
export const MEDITATION = {
  name: 'meditation',
  readable: 'Meditation',
  imageSrc: '/images/meditation-f1.jpg'
};
export const DANCE = {
  name: 'dance',
  readable: 'Dance',
  imageSrc: '/images/dance-f1.jpg'
};
export const ART = {
  name: 'art',
  readable: 'Art',
  imageSrc: '/images/art-f1.jpg'
};
export const COOKING = {
  name: 'cooking',
  readable: 'Cooking',
  imageSrc: '/images/cooking-f1.jpg'
};

export const CATEGORIES = [
  FITNESS,
  YOGA,
  MEDITATION,
  DANCE,
  ART,
  COOKING
];

export const CATEGORY_TO_VIDEO = {
  [FITNESS['name']]: {
    video_urls: [
      'https://www.youtube.com/watch?v=YdB1HMCldJY'
    ]
  },
  [YOGA['name']]: {
    video_urls: [
      'https://www.youtube.com/watch?v=v7AYKMP6rOE'
    ]
  },
  [MEDITATION['name']]: {
    video_urls: [
      'https://www.youtube.com/watch?v=1vx8iUvfyCY'
    ]
  },
  [DANCE['name']]: {
    video_urls: [
      'https://www.youtube.com/watch?v=U1_Knnpo_Ds'
    ]
  },
  [ART['name']]: {
    video_urls: [
      'https://www.youtube.com/watch?v=lLWEXRAnQd0'
    ]
  },
  [COOKING['name']]: {
    video_urls: [
      'https://www.youtube.com/watch?v=FTociictyyE'
    ]
  }
};
