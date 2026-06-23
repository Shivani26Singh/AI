import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class TodoPage extends BasePage {
  readonly newTodoInput: Locator;
  readonly todoList: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;
  readonly clearCompleted: Locator;
  readonly filterAll: Locator;
  readonly filterActive: Locator;
  readonly filterCompleted: Locator;

  constructor(page: Page) {
    super(page);
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoList = page.locator('.todo-list');
    this.todoItems = page.locator('.todo-list li');
    this.todoCount = page.locator('.todo-count');
    this.clearCompleted = page.getByRole('button', { name: 'Clear completed' });
    this.filterAll = page.getByRole('link', { name: 'All' });
    this.filterActive = page.getByRole('link', { name: 'Active' });
    this.filterCompleted = page.getByRole('link', { name: 'Completed' });
  }

  async goto(): Promise<void> {
    await this.navigate('/todomvc');
  }

  async addTodo(text: string): Promise<void> {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  async addTodos(...items: string[]): Promise<void> {
    for (const item of items) {
      await this.addTodo(item);
    }
  }

  async getTodoItem(text: string): Promise<Locator> {
    return this.todoList.getByText(text);
  }

  async toggleTodo(text: string): Promise<void> {
    const item = this.todoItems.filter({ hasText: text });
    await item.locator('.toggle').click();
  }

  async deleteTodo(text: string): Promise<void> {
    const item = this.todoItems.filter({ hasText: text });
    await item.hover();
    await item.locator('.destroy').click();
  }

  async editTodo(oldText: string, newText: string): Promise<void> {
    const item = this.todoItems.filter({ hasText: oldText });
    await item.dblclick();
    const input = item.locator('.edit');
    await input.fill(newText);
    await input.press('Enter');
  }

  async expectVisibleTodo(text: string): Promise<void> {
    await expect(this.todoList.getByText(text)).toBeVisible();
  }

  async expectHiddenTodo(text: string): Promise<void> {
    await expect(this.todoList.getByText(text)).toBeHidden();
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.todoItems).toHaveCount(count);
  }

  async expectRemainingCount(text: string): Promise<void> {
    await expect(this.todoCount).toContainText(text);
  }

  async clearCompletedTodos(): Promise<void> {
    await this.clearCompleted.click();
  }

  async filterByActive(): Promise<void> {
    await this.filterActive.click();
  }

  async filterByCompleted(): Promise<void> {
    await this.filterCompleted.click();
  }

  async filterByAll(): Promise<void> {
    await this.filterAll.click();
  }

  async todoIsChecked(text: string): Promise<void> {
    const item = this.todoItems.filter({ hasText: text });
    await expect(item.locator('.toggle')).toBeChecked();
  }
}
