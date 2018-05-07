import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VarOpenboxComponent } from './var-openbox.component';

describe('VarOpenboxComponent', () => {
  let component: VarOpenboxComponent;
  let fixture: ComponentFixture<VarOpenboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VarOpenboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VarOpenboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
