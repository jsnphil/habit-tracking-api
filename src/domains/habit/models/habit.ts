import { v4 as uuidv4 } from 'uuid';
import type { CompletionStatus, HabitStatus, HabitType } from '../types';
import type { HabitCue } from './habit-cue';
import type { HabitSchedule } from './habit-schedule';

export abstract class Habit {
  private name: string;
  private id: string;
  private description: string;
  private type: HabitType;
  private status: HabitStatus;
  private schedule: HabitSchedule;
  private cue?: HabitCue;
  private obsidianNoteName?: string;

  completionRecords: Map<string, CompletionStatus> = new Map();

  constructor(
    name: string,
    description: string,
    type: HabitType,
    schedule: HabitSchedule,
    cue?: HabitCue,
    obsidianNoteName?: string
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error('Habit name cannot be empty');
    }

    if (!schedule) {
      throw new Error('Habit must have a schedule');
    }

    this.name = name.trim();
    this.description = description;
    this.type = type;
    this.id = uuidv4();
    this.status = 'active';
    this.schedule = schedule;
    this.cue = cue;
    this.obsidianNoteName = obsidianNoteName;
  }

  /* istanbul ignore next */
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  /* istanbul ignore next */
  getDescription(): string {
    return this.description;
  }

  getObsidianNoteName(): string | undefined {
    return this.obsidianNoteName;
  }

  /* istanbul ignore next */
  getType(): HabitType {
    return this.type;
  }

  getStatus(): HabitStatus {
    return this.status;
  }

  getSchedule(): HabitSchedule {
    return this.schedule;
  }

  getCue(): HabitCue | undefined {
    return this.cue;
  }

  /* istanbul ignore next */
  setStatus(status: HabitStatus): void {
    this.status = status;
  }

  setName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Habit name cannot be empty');
    }
    this.name = name.trim();
  }

  /* istanbul ignore next */
  setDescription(description: string): void {
    this.description = description;
  }

  /* istanbul ignore next */
  setObsidianNoteName(name: string): void {
    this.obsidianNoteName = name;
  }

  /* istanbul ignore next */
  setSchedule(schedule: HabitSchedule): void {
    this.schedule = schedule;
  }

  /* istanbul ignore next */
  setCue(cue: HabitCue): void {
    this.cue = cue;
  }

  /* istanbul ignore next */
  getCompletionRecords(): Map<string, CompletionStatus> {
    return this.completionRecords;
  }

  /* istanbul ignore next */
  getCompletionStatus(date: Date): CompletionStatus {
    return (
      this.completionRecords.get(date.toISOString().split('T')[0]) || 'pending'
    );
  }

  activate() {
    if (this.status === 'archived') {
      throw new Error('Cannot activate an archived habit. Unarchive it first.');
    }
    this.status = 'active';
  }

  deactivate() {
    if (this.status === 'archived') {
      throw new Error('Cannot deactivate an archived habit');
    }
    this.status = 'inactive';
  }

  archive() {
    // Idempotent operation - archiving is always valid regardless of current status
    this.status = 'archived';
  }

  unarchive() {
    if (this.status !== 'archived') {
      throw new Error('Only archived habits can be unarchived');
    }
    this.status = 'active';
  }

  abstract markCompleted(date: Date): void;
  abstract markMissed(date: Date): void;

  markSkipped(date: Date): void {
    if (this.getStatus() === 'archived') {
      throw new Error('Cannot mark skipped for an archived habit');
    }
    if (this.getStatus() !== 'active') {
      throw new Error('Cannot mark skipped on an inactive habit');
    }

    const dateKey = date.toISOString().split('T')[0];
    if (this.completionRecords.has(dateKey)) {
      throw new Error(
        `Status for ${dateKey} already recorded. Habits can only be marked once per day.`
      );
    }
    this.completionRecords.set(dateKey, 'skipped');
  }
}
