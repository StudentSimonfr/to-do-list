import { Routes } from '@angular/router';
import { TaskList } from './task-list/task-list';
import { Stats } from './stats/stats';

export const routes: Routes = [
  { path: '', component: TaskList },
  { path: 'stats', component: Stats },
  { path: '**', redirectTo: '' }
];