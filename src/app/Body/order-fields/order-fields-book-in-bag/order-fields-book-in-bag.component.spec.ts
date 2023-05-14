import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFieldsBookInBagComponent } from './order-fields-book-in-bag.component';

describe('OrderFieldsBookInBagComponent', () => {
  let component: OrderFieldsBookInBagComponent;
  let fixture: ComponentFixture<OrderFieldsBookInBagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderFieldsBookInBagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderFieldsBookInBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
