import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { CharacterList } from './character-list';

describe('CharacterList', () => {
  let component: CharacterList;
  let fixture: ComponentFixture<CharacterList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterList],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
