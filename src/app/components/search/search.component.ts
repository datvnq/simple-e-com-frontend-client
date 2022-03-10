import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  currentCategoryId: number;

  constructor(private router: Router, private route: ActivatedRoute) { }
  

  ngOnInit(): void {
  }

  handleKeyword(keyword: string) {
    const hasCategoryId: boolean = this.route.snapshot.queryParamMap.has('categoryId');
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.queryParamMap.get('categoryId');
      this.router.navigate(['/products'], { queryParams: {categoryId: this.currentCategoryId, keyword: keyword} });
    }
    else {
      this.router.navigate(['/products'], { queryParams: {keyword: keyword} });
    }
  }

}
