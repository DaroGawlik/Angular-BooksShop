import { TestBed } from '@angular/core/testing';

import { BagListService } from './books.service';

describe('BagListService', () => {
  let service: BagListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BagListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
