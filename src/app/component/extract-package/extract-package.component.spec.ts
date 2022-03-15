import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractPackageComponent } from './extract-package.component';

describe('ExtractPackageComponent', () => {
  let component: ExtractPackageComponent;
  let fixture: ComponentFixture<ExtractPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtractPackageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
