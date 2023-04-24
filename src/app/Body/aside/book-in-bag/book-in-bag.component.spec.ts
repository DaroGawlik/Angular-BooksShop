import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookInBagComponent } from './book-in-bag.component';

describe('BookInBagComponent', () => {
  let component: BookInBagComponent;
  let fixture: ComponentFixture<BookInBagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookInBagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookInBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
