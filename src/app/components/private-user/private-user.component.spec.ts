import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateUserComponent } from './private-user.component';

describe('PrivateUserComponent', () => {
  let component: PrivateUserComponent;
  let fixture: ComponentFixture<PrivateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
