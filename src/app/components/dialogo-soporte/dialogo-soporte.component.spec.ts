import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoSoporteComponent } from './dialogo-soporte.component';

describe('DialogoSoporteComponent', () => {
  let component: DialogoSoporteComponent;
  let fixture: ComponentFixture<DialogoSoporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoSoporteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogoSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
