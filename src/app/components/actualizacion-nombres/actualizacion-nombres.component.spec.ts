import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizacionNombresComponent } from './actualizacion-nombres.component';

describe('ActualizacionNombresComponent', () => {
  let component: ActualizacionNombresComponent;
  let fixture: ComponentFixture<ActualizacionNombresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizacionNombresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActualizacionNombresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
