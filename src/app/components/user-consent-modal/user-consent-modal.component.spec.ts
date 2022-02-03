import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConsentModalComponent } from './user-consent-modal.component';

describe('UserConsentModalComponent', () => {
  let component: UserConsentModalComponent;
  let fixture: ComponentFixture<UserConsentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserConsentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConsentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
