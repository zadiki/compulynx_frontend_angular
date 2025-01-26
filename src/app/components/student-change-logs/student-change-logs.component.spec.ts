import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentChangeLogsComponent } from './student-change-logs.component';

describe('StudentChangeLogsComponent', () => {
  let component: StudentChangeLogsComponent;
  let fixture: ComponentFixture<StudentChangeLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentChangeLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentChangeLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
