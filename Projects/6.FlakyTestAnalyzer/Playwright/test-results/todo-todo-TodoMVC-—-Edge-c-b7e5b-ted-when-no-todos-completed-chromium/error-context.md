# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: todo\todo.spec.ts >> TodoMVC — Edge cases >> should not show clear-completed when no todos completed
- Location: tests\e2e\todo\todo.spec.ts:141:3

# Error details

```
Error: Flaky — clear-completed visibility race
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - text: This is just a demo of TodoMVC for testing, not the
    - link "real TodoMVC app." [ref=e3] [cursor=pointer]:
      - /url: https://todomvc.com/
  - generic [ref=e6]:
    - heading "todos" [level=1] [ref=e7]
    - textbox "What needs to be done?" [active] [ref=e8]
  - contentinfo [ref=e9]:
    - paragraph [ref=e10]: Double-click to edit a todo
    - paragraph [ref=e11]:
      - text: Created by
      - link "Remo H. Jansen" [ref=e12] [cursor=pointer]:
        - /url: http://github.com/remojansen/
    - paragraph [ref=e13]:
      - text: Part of
      - link "TodoMVC" [ref=e14] [cursor=pointer]:
        - /url: http://todomvc.com
```

# Test source

```ts
  42  |     await todoPage.toggleTodo(TEST_ITEMS[0]);
  43  |     await todoPage.todoIsChecked(TEST_ITEMS[0]);
  44  |   });
  45  | 
  46  |   test('should delete a todo item', async ({ todoPage }) => {
  47  |     const items = pickRandom(TEST_ITEMS, 3);
  48  |     await todoPage.addTodos(...items);
  49  |     await todoPage.deleteTodo(items[1]);
  50  |     await todoPage.expectItemCount(2);
  51  |   });
  52  | 
  53  |   test('should edit a todo item', async ({ todoPage, page }) => {
  54  |     if (shouldFlake(0)) throw new Error('Flaky — race condition on edit input');
  55  |     await todoPage.addTodo('Original task');
  56  |     await todoPage.editTodo('Original task', 'Updated task');
  57  |     await todoPage.expectVisibleTodo('Updated task');
  58  |   });
  59  | 
  60  |   test('should clear completed todos', async ({ todoPage }) => {
  61  |     await todoPage.addTodo('Task A');
  62  |     await todoPage.addTodo('Task B');
  63  |     await todoPage.toggleTodo('Task A');
  64  |     await todoPage.clearCompletedTodos();
  65  |     await todoPage.expectItemCount(1);
  66  |     await todoPage.expectHiddenTodo('Task A');
  67  |   });
  68  | 
  69  |   test('should filter active todos', async ({ todoPage }) => {
  70  |     await todoPage.addTodo('Task A');
  71  |     await todoPage.addTodo('Task B');
  72  |     await todoPage.toggleTodo('Task A');
  73  |     await todoPage.filterByActive();
  74  |     await todoPage.expectVisibleTodo('Task B');
  75  |     await todoPage.expectHiddenTodo('Task A');
  76  |   });
  77  | 
  78  |   test('should filter completed todos', async ({ todoPage }) => {
  79  |     await todoPage.addTodo('Task A');
  80  |     await todoPage.addTodo('Task B');
  81  |     await todoPage.toggleTodo('Task A');
  82  |     await todoPage.filterByCompleted();
  83  |     await todoPage.expectVisibleTodo('Task A');
  84  |     await todoPage.expectHiddenTodo('Task B');
  85  |   });
  86  | 
  87  |   test('should show remaining count', async ({ todoPage }) => {
  88  |     await todoPage.addTodos(...TEST_ITEMS.slice(0, 5));
  89  |     await todoPage.toggleTodo(TEST_ITEMS[0]);
  90  |     await todoPage.toggleTodo(TEST_ITEMS[1]);
  91  |     await todoPage.expectRemainingCount('3');
  92  |   });
  93  | 
  94  |   test('should persist todos after page reload', async ({ todoPage, page }) => {
  95  |     if (shouldFlake(1)) throw new Error('Flaky — localStorage persistence race');
  96  |     await todoPage.addTodo('Persistent task');
  97  |     await page.reload();
  98  |     await todoPage.waitForPageLoad();
  99  |     await todoPage.expectVisibleTodo('Persistent task');
  100 |   });
  101 | });
  102 | 
  103 | test.describe('TodoMVC — Edge cases', () => {
  104 |   test.beforeEach(async ({ todoPage }) => {
  105 |     await todoPage.goto();
  106 |   });
  107 | 
  108 |   test('should handle empty todo submission', async ({ todoPage }) => {
  109 |     await todoPage.newTodoInput.fill('');
  110 |     await todoPage.newTodoInput.press('Enter');
  111 |     await todoPage.expectItemCount(0);
  112 |   });
  113 | 
  114 |   test('should trim whitespace in todo text', async ({ todoPage }) => {
  115 |     await todoPage.addTodo('   Trimmed task   ');
  116 |     await todoPage.expectVisibleTodo('Trimmed task');
  117 |     await todoPage.expectItemCount(1);
  118 |   });
  119 | 
  120 |   test('should handle special characters', async ({ todoPage }) => {
  121 |     await todoPage.addTodo('Task with <script>alert("xss")</script>');
  122 |     await todoPage.expectVisibleTodo('<script>alert("xss")</script>');
  123 |   });
  124 | 
  125 |   test('should handle very long task names', async ({ todoPage }) => {
  126 |     const longName = 'A'.repeat(255);
  127 |     await todoPage.addTodo(longName);
  128 |     await todoPage.expectVisibleTodo(longName);
  129 |   });
  130 | 
  131 |   test('should toggle a todo multiple times', async ({ todoPage, page }) => {
  132 |     await todoPage.addTodo('Toggle me');
  133 |     await todoPage.toggleTodo('Toggle me');
  134 |     await todoPage.todoIsChecked('Toggle me');
  135 |     await todoPage.toggleTodo('Toggle me');
  136 |     await expect(
  137 |       page.locator('.todo-list li').filter({ hasText: 'Toggle me' }).locator('.toggle')
  138 |     ).not.toBeChecked();
  139 |   });
  140 | 
  141 |   test('should not show clear-completed when no todos completed', async ({ todoPage, page }) => {
> 142 |     if (shouldFlake(2)) throw new Error('Flaky — clear-completed visibility race');
      |                               ^ Error: Flaky — clear-completed visibility race
  143 |     await todoPage.addTodo('Lonely task');
  144 |     await expect(todoPage.clearCompleted).toBeHidden();
  145 |   });
  146 | });
  147 | 
```