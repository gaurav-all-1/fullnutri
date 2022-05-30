import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductcheckoutComponent } from './productcheckout.component';

describe('ProductcheckoutComponent', () => {
  let component: ProductcheckoutComponent;
  let fixture: ComponentFixture<ProductcheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductcheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductcheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
