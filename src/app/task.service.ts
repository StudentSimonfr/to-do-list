// ANGULAR : TaskService (signals) = liste + opérations + persistance localStorage
import { Injectable, computed, effect, signal } from '@angular/core';
import { Task, loadTasks, saveTasks } from './task';

@Injectable({ providedIn: 'root' })
export class TaskService {
  // Lecture AVANT l'effet de sauvegarde (sinon [] pourrait écraser les données)
  private readonly state = signal<Task[]>(loadTasks());
  readonly tasks = this.state.asReadonly();

  // Stats pour la route /stats
  readonly total = computed(() => this.tasks().length);
  readonly done = computed(() => this.tasks().filter(t => t.done).length);
  readonly remaining = computed(() => this.total() - this.done());
  readonly percent = computed(() =>
    this.total() === 0 ? 0 : Math.round((100 * this.done()) / this.total())
  );

  constructor() {
    // Sauvegarde automatique à chaque changement de la liste
    effect(() => {
      saveTasks(this.state());
    });
  }

  add(data: { title: string; description?: string; dueDate?: string }) {
    const now = new Date().toISOString();
    const task: Task = {
      ...data,
      id: crypto.randomUUID(),
      done: false,
      createdAt: now,
      updatedAt: now,
    };
    this.state.update(list => [...list, task]);
  }

  toggle(id: string) {
    this.state.update(list =>
      list.map(t =>
        t.id === id ? { ...t, done: !t.done, updatedAt: new Date().toISOString() } : t
      )
    );
  }

  update(id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>) {
    this.state.update(list =>
      list.map(t =>
        t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
      )
    );
  }

  remove(id: string) {
    this.state.update(list => list.filter(t => t.id !== id));
  }
}

// Dans un composant : readonly service = inject(TaskService);
// Template : @for (t of service.tasks(); track t.id) { ... }
