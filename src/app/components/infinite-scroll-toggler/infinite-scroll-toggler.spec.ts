import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteScrollToggler } from './infinite-scroll-toggler';

describe('InfiniteScrollToggler', () => {
  let component: InfiniteScrollToggler;
  let fixture: ComponentFixture<InfiniteScrollToggler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfiniteScrollToggler],
    }).compileComponents();

    fixture = TestBed.createComponent(InfiniteScrollToggler);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
