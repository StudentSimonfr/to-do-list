//lit la liste, applique recherche, filtre et tri avec un computed , puis affiche un TaskItem par tâche.
import { Component, computed, inject, signal } from '@angular/core';
import { Task, TaskData } from '../task';
import { TaskService } from '../task.service';
import { TaskForm } from '../task-form/task-form';
import { TaskItem } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  imports: [TaskForm, TaskItem],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList {
  readonly service = inject(TaskService);

  readonly status = signal<'all' | 'todo' | 'done'>('all');
  readonly query = signal('');
  readonly editingId = signal<string | null>(null);

  // Liste affichée : filtre + recherche + tri (le service garde la liste complète)
  readonly visible = computed(() => {
    const status = this.status();
    const q = this.query().trim().toLocaleLowerCase();
    return this.service.tasks()
      .filter(t =>
        (status === 'all' || t.done === (status === 'done'))
        && t.title.toLocaleLowerCase().includes(q))
      .sort((a, b) =>
        (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31')
        || a.title.localeCompare(b.title));
  });

  add(data: TaskData) {
    this.service.add(data);
  }

  save(id: string, data: TaskData) {
    this.service.update(id, data);
    this.editingId.set(null);   // ferme le formulaire d'édition
  }

  remove(task: Task) {
    if (confirm(`Supprimer « ${task.title} » ?`)) {
      this.service.remove(task.id);
    }
  }
}