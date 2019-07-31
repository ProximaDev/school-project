import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransComponent } from './trans.component';

describe('TransComponent', () => {
  let component: TransComponent;
  let fixture: ComponentFixture<TransComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
