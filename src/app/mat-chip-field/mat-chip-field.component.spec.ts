import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatChipFieldComponent } from './mat-chip-field.component';

describe('MatChipFieldComponent', () => {
  let component: MatChipFieldComponent;
  let fixture: ComponentFixture<MatChipFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatChipFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatChipFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
