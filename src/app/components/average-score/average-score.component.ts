import { Component, Input } from '@angular/core';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-average-score',
  imports: [],
  templateUrl: './average-score.component.html',
  styleUrl: './average-score.component.scss',
})
export class AverageScoreComponent {
  @Input() selected!: Student[];
  get averageScore(): string {
    if (this.selected.length == 0) {
      return '0';
    }
    const total = this.selected.reduce(
      (sum, student) => sum + student.score,
      0
    );
    return (total / this.selected.length).toFixed(2);
  }
}
