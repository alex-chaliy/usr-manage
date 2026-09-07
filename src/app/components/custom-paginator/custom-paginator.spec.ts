import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPaginator } from './custom-paginator';

describe('CustomPaginator', () => {
  let component: CustomPaginator;
  let fixture: ComponentFixture<CustomPaginator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPaginator],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomPaginator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
