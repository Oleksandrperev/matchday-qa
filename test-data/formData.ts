export const validFormData = {
  date: 'today' as const,
  timeRange: 'afternoon',
  location: 'north-seattle',
  position: 'midfielder',
  skillLevel: 'intermediate' as const,
};

export const minimalFormData = {
  date: 'tomorrow' as const,
  timeRange: 'evening',
  location: 'bellevue',
  skillLevel: 'beginner' as const,
};

export const testUser = {
  name: 'Test Player',
  email: 'testplayer@example.com',
  password: 'TestPass123!',
};
