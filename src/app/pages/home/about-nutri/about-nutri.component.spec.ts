import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutNutriComponent } from './about-nutri.component';

describe('AboutNutriComponent', () => {
  let component: AboutNutriComponent;
  let fixture: ComponentFixture<AboutNutriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutNutriComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutNutriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
