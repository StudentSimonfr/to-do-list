import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from '../task';

@Component({
  selector: 'app-task-item',
  imports: [DatePipe],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css'
})
export class TaskItem {
  readonly task = input.required<Task>();
  readonly toggled = output<string>();
  readonly edit = output<string>();
  readonly deleted = output<string>();
}