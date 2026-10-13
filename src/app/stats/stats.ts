import { Component, inject } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.html',
  styleUrl: './stats.css'
})
export class Stats {
  readonly service = inject(TaskService);
}