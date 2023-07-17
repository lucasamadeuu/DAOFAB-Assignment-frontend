import { Component } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss']
})
export class ParentComponent {
  title = 'daofab';
  dataSource: any;
  page: number = 0;
  loading = true;
  noCotent = false;
  subscription: Subscription = new Subscription;

  searchForm = new FormGroup({
    currentPage: new FormControl(0),
    pageSize: new FormControl(2)
  })

  constructor(
    private api: ApiService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  displayedColumns = ["id", "sender", "receiver", "totalAmount", "totalPaidAmount", "totalPaidAmountButton"]

  ngOnInit(): void {
    this.subscription = this.route.queryParams.subscribe(value => {
      const newValue = { ...value }

      if (value['pageSize'] && value['currentPage']) {
        newValue['pageSize'] = parseInt(value['pageSize'])
        newValue['currentPage'] = parseInt(value['currentPage'])
      }
    })

    this.getJsonData()
  }

  handlePageEvent(event: PageEvent) {
    this.searchForm.get('currentPage')?.setValue(event.pageIndex)
    this.getJsonData()
  }

  updateSearchParams() {
    this.router.navigate([], { relativeTo: this.route, queryParams: this.searchForm.getRawValue() })
  }

  goToChild(id: number) {
    this.router.navigate(['/child'], { queryParams: { id: id } });
  }

  getJsonData() {
    const pageSize = this.searchForm.get('pageSize')?.value ?? 2;
    const currentPage = this.searchForm.get('currentPage')?.value ?? 0;

    const req = {
      pageSize: pageSize,
      currentPage: currentPage
    };


    this.api.getParentData(req).pipe(
      tap((res: any) => {
        this.loading = false;
        this.dataSource = res;

        if (res?.length == 0) {
          this.snackbar.open('No data found with these parameters', 'Undo,', { duration: 1200 });
        }
      })
    ).subscribe({
      error: (err) => {
        this.loading = false;
        this.dataSource = [];

        this.snackbar.open('No data found with these parameters', 'Undo,', { duration: 1200 });
      }
    });

    this.updateSearchParams()
  }
}
