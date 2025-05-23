import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPropertyComponent } from './preview-property.component';

describe('PreviewPropertyComponent', () => {
  let component: PreviewPropertyComponent;
  let fixture: ComponentFixture<PreviewPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
