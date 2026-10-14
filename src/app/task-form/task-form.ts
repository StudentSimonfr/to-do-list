//TaskForm valide la saisie et émet saved;TaskList appelle alors le service
import { Component, OnInit, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Task, TaskData } from '../task';
import { titleMin3, validDueDate, todayLocal } from '../task-validators';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnInit {
  private static counter = 0;
  readonly uid = `task-form-${TaskForm.counter++}`;   // identifiant unique par instance

  readonly task = input<Task | null>(null);          // fournie = mode édition
  readonly saved = output<TaskData>();
  readonly cancelled = output<void>();

  readonly today = todayLocal();
  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [titleMin3] }),
    description: new FormControl('', { nonNullable: true }),
    dueDate: new FormControl('', { nonNullable: true, validators: [validDueDate] })
  });

  ngOnInit() {
    const t = this.task();
    if (t) {
      this.form.setValue({
        title: t.title,
        description: t.description ?? '',
        dueDate: t.dueDate ?? ''
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.saved.emit({
      title: v.title.trim(),
      description: v.description.trim() || undefined,
      dueDate: v.dueDate || undefined
    });
    if (!this.task()) this.form.reset();   // création : on vide le formulaire
  }
}