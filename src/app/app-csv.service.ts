import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppCSVService {
  url = 'http://localhost:8100/assets/data/data1.csv';
  constructor(public http: HttpClient) { }


  public loadCSV() {
    return this.http.get(this.url, { responseType: 'text' });
  }
}
