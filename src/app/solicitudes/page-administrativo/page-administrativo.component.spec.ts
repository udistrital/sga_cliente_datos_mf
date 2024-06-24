import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAdministrativoComponent } from './page-administrativo.component';

describe('ListSolicitudesEstudianteComponent', () => {
  let component: PageAdministrativoComponent;
  let fixture: ComponentFixture<PageAdministrativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageAdministrativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAdministrativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
