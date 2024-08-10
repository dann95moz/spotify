import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatedCardListComponent } from './paginated-card-list.component';

describe('PaginatedCardListComponent', () => {
  let component: PaginatedCardListComponent;
  let fixture: ComponentFixture<PaginatedCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatedCardListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginatedCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
