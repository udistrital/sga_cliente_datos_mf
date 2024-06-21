import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEstudiantesComponent } from './page-estudiantes.component';

describe('ViewSolicitudesComponent', () => {
  let component: PageEstudiantesComponent;
  let fixture: ComponentFixture<PageEstudiantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageEstudiantesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
