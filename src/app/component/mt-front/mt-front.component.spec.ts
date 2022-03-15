import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtFrontComponent } from './mt-front.component';

describe('MtFrontComponent', () => {
  let component: MtFrontComponent;
  let fixture: ComponentFixture<MtFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtFrontComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
