import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VarOverlapComponent } from './var-overlap.component';

describe('VarOverlapComponent', () => {
  let component: VarOverlapComponent;
  let fixture: ComponentFixture<VarOverlapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VarOverlapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VarOverlapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
