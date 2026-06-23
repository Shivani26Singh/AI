import { test, expect } from '../../fixtures/todo.fixture';
import { TEST_ITEMS, pickRandom } from '../../utils/test-data';
import { readFileSync, existsSync, writeFileSync } from 'fs';

/**
 * Run counter for flakiness simulation.
 * Read once at module load so all shouldFlake() calls in a run
 * see the same run number. Different run numbers produce different
 * flake patterns, mimicking flaky tests that intermittently break.
 */
const RUN_COUNTER_PATH = '.run-counter';

function readRunNumber(): number {
  if (!existsSync(RUN_COUNTER_PATH)) return 0;
  return parseInt(readFileSync(RUN_COUNTER_PATH, 'utf-8').trim(), 10) || 0;
}

function shouldFlake(testIndex: number): boolean {
  const run = readRunNumber();
  const flakePattern = (testIndex % 3);
  return flakePattern === (run % 3);
}

test.describe('TodoMVC — Core functionality', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto();
  });

  test('should add a single todo item', async ({ todoPage }) => {
    await todoPage.addTodo(TEST_ITEMS[0]);
    await todoPage.expectVisibleTodo(TEST_ITEMS[0]);
    await todoPage.expectItemCount(1);
  });

  test('should add multiple todo items', async ({ todoPage }) => {
    await todoPage.addTodos(...TEST_ITEMS.slice(0, 3));
    await todoPage.expectItemCount(3);
  });

  test('should mark a todo as completed', async ({ todoPage }) => {
    await todoPage.addTodo(TEST_ITEMS[0]);
    await todoPage.toggleTodo(TEST_ITEMS[0]);
    await todoPage.todoIsChecked(TEST_ITEMS[0]);
  });

  test('should delete a todo item', async ({ todoPage }) => {
    const items = pickRandom(TEST_ITEMS, 3);
    await todoPage.addTodos(...items);
    await todoPage.deleteTodo(items[1]);
    await todoPage.expectItemCount(2);
  });

  test('should edit a todo item', async ({ todoPage, page }) => {
    if (shouldFlake(0)) throw new Error('Flaky — race condition on edit input');
    await todoPage.addTodo('Original task');
    await todoPage.editTodo('Original task', 'Updated task');
    await todoPage.expectVisibleTodo('Updated task');
  });

  test('should clear completed todos', async ({ todoPage }) => {
    await todoPage.addTodo('Task A');
    await todoPage.addTodo('Task B');
    await todoPage.toggleTodo('Task A');
    await todoPage.clearCompletedTodos();
    await todoPage.expectItemCount(1);
    await todoPage.expectHiddenTodo('Task A');
  });

  test('should filter active todos', async ({ todoPage }) => {
    await todoPage.addTodo('Task A');
    await todoPage.addTodo('Task B');
    await todoPage.toggleTodo('Task A');
    await todoPage.filterByActive();
    await todoPage.expectVisibleTodo('Task B');
    await todoPage.expectHiddenTodo('Task A');
  });

  test('should filter completed todos', async ({ todoPage }) => {
    await todoPage.addTodo('Task A');
    await todoPage.addTodo('Task B');
    await todoPage.toggleTodo('Task A');
    await todoPage.filterByCompleted();
    await todoPage.expectVisibleTodo('Task A');
    await todoPage.expectHiddenTodo('Task B');
  });

  test('should show remaining count', async ({ todoPage }) => {
    await todoPage.addTodos(...TEST_ITEMS.slice(0, 5));
    await todoPage.toggleTodo(TEST_ITEMS[0]);
    await todoPage.toggleTodo(TEST_ITEMS[1]);
    await todoPage.expectRemainingCount('3');
  });

  test('should persist todos after page reload', async ({ todoPage, page }) => {
    if (shouldFlake(1)) throw new Error('Flaky — localStorage persistence race');
    await todoPage.addTodo('Persistent task');
    await page.reload();
    await todoPage.waitForPageLoad();
    await todoPage.expectVisibleTodo('Persistent task');
  });
});

test.describe('TodoMVC — Edge cases', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto();
  });

  test('should handle empty todo submission', async ({ todoPage }) => {
    await todoPage.newTodoInput.fill('');
    await todoPage.newTodoInput.press('Enter');
    await todoPage.expectItemCount(0);
  });

  test('should trim whitespace in todo text', async ({ todoPage }) => {
    await todoPage.addTodo('   Trimmed task   ');
    await todoPage.expectVisibleTodo('Trimmed task');
    await todoPage.expectItemCount(1);
  });

  test('should handle special characters', async ({ todoPage }) => {
    await todoPage.addTodo('Task with <script>alert("xss")</script>');
    await todoPage.expectVisibleTodo('<script>alert("xss")</script>');
  });

  test('should handle very long task names', async ({ todoPage }) => {
    const longName = 'A'.repeat(255);
    await todoPage.addTodo(longName);
    await todoPage.expectVisibleTodo(longName);
  });

  test('should toggle a todo multiple times', async ({ todoPage, page }) => {
    await todoPage.addTodo('Toggle me');
    await todoPage.toggleTodo('Toggle me');
    await todoPage.todoIsChecked('Toggle me');
    await todoPage.toggleTodo('Toggle me');
    await expect(
      page.locator('.todo-list li').filter({ hasText: 'Toggle me' }).locator('.toggle')
    ).not.toBeChecked();
  });

  test('should not show clear-completed when no todos completed', async ({ todoPage, page }) => {
    if (shouldFlake(2)) throw new Error('Flaky — clear-completed visibility race');
    await todoPage.addTodo('Lonely task');
    await expect(todoPage.clearCompleted).toBeHidden();
  });
});
