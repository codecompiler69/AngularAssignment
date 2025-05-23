import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SearchFilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any>();

  filters = {
    searchQuery: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    propertyType: 'all', // 'all', 'shared', 'private'
    leaseType: 'all', // 'all', 'short-term', 'long-term'
    isFurnished: 'all', // 'all', 'furnished', 'unfurnished'
  };

  constructor() {}

  ngOnInit(): void {
    // Emit initial filter values
    this.applyFilters();
  }

  applyFilters(): void {
    this.filterChange.emit({ ...this.filters });
  }

  resetFilters(): void {
    this.filters = {
      searchQuery: '',
      minPrice: null,
      maxPrice: null,
      propertyType: 'all',
      leaseType: 'all',
      isFurnished: 'all',
    };

    this.applyFilters();
  }
}
