import { Component, DestroyRef, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { CharacterSearchQueryParam } from '../schemas/character-search-query-param.schema';

@Component({
  selector: 'app-character-filter',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './character-filter.html',
  styleUrl: './character-filter.css',
})
export class CharacterFilter {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  readonly filtersChanged = output<CharacterSearchQueryParam>();
  readonly filterForm = this.formBuilder.nonNullable.group({
    name: '',
    gender: '',
  });

  constructor() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(250),
        map(({ name, gender }) => ({
          name: name?.trim() || undefined,
          gender: gender || undefined,
          page: 0,
          size: 8,
        })),
        distinctUntilChanged(
          (previous, current) =>
            previous.name === current.name && previous.gender === current.gender,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((query) => this.filtersChanged.emit(query));
  }

  clear(): void {
    this.filterForm.reset();
  }
}
