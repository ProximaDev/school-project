import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttitudeComponent } from './attitude.component';

describe('AttitudeComponent', () => {
  let component: AttitudeComponent;
  let fixture: ComponentFixture<AttitudeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttitudeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttitudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
