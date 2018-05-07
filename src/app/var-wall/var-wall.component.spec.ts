import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VarWallComponent } from './var-wall.component';

describe('VarWallComponent', () => {
  let component: VarWallComponent;
  let fixture: ComponentFixture<VarWallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VarWallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VarWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
