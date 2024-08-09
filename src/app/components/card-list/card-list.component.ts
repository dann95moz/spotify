import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { SearchResult } from '@interfaces/searchResult';

@Component({
  selector: 'card-list',
  standalone: true,
  imports: [MatCardModule,MatListModule],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent {
  constructor(private router: Router) { }
  @Input() paginatedResults:SearchResult[]=[]
  viewDetails(item: SearchResult): void {
    this.router.navigate(['/details', item.type, item.id]);
  }
}
