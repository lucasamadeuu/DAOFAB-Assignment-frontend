import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { Subscription, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent {
  dataSource: any;
  loading = true;
  noCotent = false;
  id: number = 0;
  subscription: Subscription = new Subscription;
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  displayedColumns = ["id", "sender", "receiver", "totalAmount", "PaidAmount"]

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    this.getJsonData(this.id)
  }

  goBack() {
    this.router.navigate(['']);
  }


  getJsonData(id: number) {
    this.api.getChildData(id).pipe(
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
  }

}
