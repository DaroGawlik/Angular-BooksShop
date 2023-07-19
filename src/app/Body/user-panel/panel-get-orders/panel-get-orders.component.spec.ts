import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelGetOrdersComponent } from './panel-get-orders.component';

describe('PanelGetOrdersComponent', () => {
  let component: PanelGetOrdersComponent;
  let fixture: ComponentFixture<PanelGetOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelGetOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelGetOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
