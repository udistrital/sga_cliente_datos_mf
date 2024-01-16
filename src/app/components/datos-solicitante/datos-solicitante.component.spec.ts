import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosSolicitanteComponent } from './datos-solicitante.component';

describe('DatosSolicitanteComponent', () => {
  let component: DatosSolicitanteComponent;
  let fixture: ComponentFixture<DatosSolicitanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosSolicitanteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosSolicitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
