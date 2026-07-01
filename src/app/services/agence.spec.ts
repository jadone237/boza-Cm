import { TestBed } from '@angular/core/testing';

import { Agence } from './agence';

describe('Agence', () => {
  let service: Agence;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Agence);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
