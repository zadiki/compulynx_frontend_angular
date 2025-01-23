import { Component, Input } from '@angular/core';
import { Student } from '../../models/student.model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-selected-students',
  imports: [NgFor],
  templateUrl: './selected-students.component.html',
  styleUrl: './selected-students.component.scss',
})
export class SelectedStudentsComponent {
  @Input() selected!: Student[];

  get totalScore(): number {
    const total = this.selected.reduce(
      (sum, student) => sum + student.score,
      0
    );
    return total;
  }
}
