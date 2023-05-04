import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesWindowComponent } from './sales-window.component';

describe('SalesWindowComponent', () => {
  let component: SalesWindowComponent;
  let fixture: ComponentFixture<SalesWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
