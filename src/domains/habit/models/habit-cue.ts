import { v4 as uuidv4 } from 'uuid';

export class HabitCue {
  readonly id: string;
  readonly description: string;

  constructor(description: string) {
    this.id = uuidv4();
    this.description = description;
  }
}
