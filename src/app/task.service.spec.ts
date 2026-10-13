import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  beforeEach(() => localStorage.clear());

  it('ajoute une tâche avec done = false', () => {
    const service = TestBed.inject(TaskService);
    service.add({ title: 'Acheter du pain' });
    expect(service.tasks().length).toBe(1);
    expect(service.tasks()[0].done).toBe(false);
  });

  it('toggle met à jour statut et compteurs', () => {
    const service = TestBed.inject(TaskService);
    service.add({ title: 'Test' });
    service.toggle(service.tasks()[0].id);
    expect(service.done()).toBe(1);
    expect(service.remaining()).toBe(0);
    expect(service.percent()).toBe(100);
  });

  it('percent vaut 0 si la liste est vide', () => {
    expect(TestBed.inject(TaskService).percent()).toBe(0);
  });
});