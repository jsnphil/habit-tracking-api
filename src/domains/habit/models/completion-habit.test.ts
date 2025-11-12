import { describe, it, expect } from 'vitest';
import { CompletionHabit } from './completion-habit';

// We recommend installing an extension to run vitest tests.

describe('CompletionHabit.create', () => {
    it('creates a CompletionHabit instance with the provided name and description', () => {
        const name = 'Read a book';
        const description = 'Read 20 pages every day';
        const habit = CompletionHabit.create(name, description);

        expect(habit).toBeInstanceOf(CompletionHabit);
        expect(habit.type).toBe('completion');

        // Access as any to avoid depending on the exact visibility of properties on the base class
        expect((habit as any).name).toBe(name);
        expect((habit as any).description).toBe(description);
    });

    it('returns a distinct instance on each call', () => {
        const h1 = CompletionHabit.create('Exercise', 'Do 30 minutes');
        const h2 = CompletionHabit.create('Exercise', 'Do 30 minutes');

        expect(h1).not.toBe(h2);
    });

    it('accepts empty strings for name and description', () => {
        const empty = CompletionHabit.create('', '');
        expect((empty as any).name).toBe('');
        expect((empty as any).description).toBe('');
        expect(empty.type).toBe('completion');
    });
});