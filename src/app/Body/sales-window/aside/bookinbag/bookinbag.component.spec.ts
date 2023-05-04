import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookinbagComponent } from './bookinbag.component';

describe('BookinbagComponent', () => {
  let component: BookinbagComponent;
  let fixture: ComponentFixture<BookinbagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookinbagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookinbagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
