export const TEST_ITEMS = [
  'Buy groceries',
  'Walk the dog',
  'Write Playwright tests',
  'Review pull request',
  'Fix failing CI build',
  'Update documentation',
  'Refactor auth module',
  'Add unit tests for API',
  'Optimize database queries',
  'Deploy to staging',
];

export function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
