import { v4 as uuidv4 } from 'uuid';

export class HabitCue {
  private id: string;
  private description: string;

  private constructor(description: string) {
    this.id = uuidv4();
    this.description = description;
  }

  static create(description: string): HabitCue {
    if (description.trim().length === 0) {
      throw new Error('Cue description cannot be empty');
    }

    return new HabitCue(description.trim());
  }

  /* istanbul ignore next */
  getId(): string {
    return this.id;
  }

  getDescription(): string {
    return this.description;
  }
}
