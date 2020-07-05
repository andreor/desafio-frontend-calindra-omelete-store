//app.component.ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
 


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], 
  encapsulation: ViewEncapsulation.None, 


})
export class AppComponent implements OnInit {
  searchItensCtrl = new FormControl();
  filteredItems: any;
  isLoading = false;
  errorMsg: string;
 

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
  
    
    this.searchItensCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredItems = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http.get("https://cors-anywhere.herokuapp.com/https://store.omelete.com.br/autocomplete/" + value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe(data => {
        if (data['items'] == undefined) {
          this.errorMsg = data['Error'];
          this.filteredItems = [];
        } else {
          this.errorMsg = "";
          this.filteredItems = data['items'];
        }

        console.log(this.filteredItems);
      });
  }
}
