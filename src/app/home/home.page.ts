import { Component } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppCSVService } from '../app-csv.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  csvData: any[] = [];
  headerRow: any[] = [];

  constructor(
    public papa: Papa, public platf: Platform,
    public file: File, public csvService: AppCSVService, public socialSharing: SocialSharing) {
    this.csvService.loadCSV().subscribe(data => this.extractData(data), err => console.log('something went wrong: ', err));
  }

  private extractData(res) {
    // tslint:disable-next-line:prefer-const
    let csvData = res || '';

    this.papa.parse(csvData, {
      complete: parsedData => {
        console.log(`${parsedData.data} this is the parsedData`);
        this.headerRow = parsedData.data.splice(0, 1)[0];
        console.log(this.headerRow);
        this.csvData = parsedData.data;
        console.log(this.csvData);
      }
    });
  }

  exportCSV() {
    // tslint:disable-next-line:prefer-const
    let csv = this.papa.unparse({
      fields: this.headerRow,
      data: this.csvData
    });
    if (this.platf.is('cordova')) {
      this.file.writeFile(this.file.dataDirectory, 'data1.csv', csv, { replace: true }).then(res => {
        this.socialSharing.share(null, null, res.nativeURL, null).then(e => {
          // Success
        }).catch(e => {
          console.log('Share failed:', e);
        });
      }, err => {
        console.log('Error: ', err);
      });
    } else {
      // Dummy implementation for Desktop download purpose
      var blob = new Blob([csv]);
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'data1.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
  trackByFn(index: any, item: any) {
    console.log(item);
    console.log(index);
    return index;
  }

}

