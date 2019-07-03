import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllNotifyComponent } from './all-notify.component';

describe('AllNotifyComponent', () => {
  let component: AllNotifyComponent;
  let fixture: ComponentFixture<AllNotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllNotifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
