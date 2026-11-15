import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { Characters } from './characters';

describe('Characters', () => {
  let component: Characters;
  let fixture: ComponentFixture<Characters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Characters],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Characters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
