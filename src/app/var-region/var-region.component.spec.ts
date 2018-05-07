import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VarRegionComponent } from './var-region.component';

describe('VarRegionComponent', () => {
  let component: VarRegionComponent;
  let fixture: ComponentFixture<VarRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VarRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VarRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
