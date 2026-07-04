import { TestBed } from '@angular/core/testing';

import { Billet } from './billet';

describe('Billet', () => {
  let service: Billet;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Billet);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
