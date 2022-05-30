import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialauthComponent } from './socialauth.component';

describe('SocialauthComponent', () => {
  let component: SocialauthComponent;
  let fixture: ComponentFixture<SocialauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialauthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
