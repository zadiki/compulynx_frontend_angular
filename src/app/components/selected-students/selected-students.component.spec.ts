import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedStudentsComponent } from './selected-students.component';

describe('SelectedStudentsComponent', () => {
  let component: SelectedStudentsComponent;
  let fixture: ComponentFixture<SelectedStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
