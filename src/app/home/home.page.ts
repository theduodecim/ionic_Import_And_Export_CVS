import { Component } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppCSVService } from '../app-csv.service';

class ImageSnippet {
  pending = false;
  status = 'initializing';
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  csvData: any[] = [];
  headerRow: any[] = [];
  public testHeaders;
  public testValues: any[] = [];
  public selectedFile: ImageSnippet;
  constructor(
    public papa: Papa, public platf: Platform,
    public file: File, public csvService: AppCSVService, public socialSharing: SocialSharing) {
    // Load from cvs utilizing httpClient
    //  this.csvService.loadCSV().subscribe(data => this.extractData(data), err => console.log('something went wrong: ', err));
  }

  processFile(imageInput: any) {
    //  console.log(imageInput);
    const file: File = imageInput.files[0];
    console.log(file);
    this.extractData(file);
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      console.log(this.selectedFile);
      console.log('asdasd');
      // const tempFile = this.escapeSpecialChars(this.selectedFile.file);
      this.selectedFile.pending = true;
    });
    // reader.readAsDataURL(file);
  }

  public extractData(res) {
    console.log('method triggered');
    let csvData = [
      { key: "-M4GMZB_pIITGiFBll9r", categoria: "bebidas", inventario: 20, nroprod: 1, preciocom: 25 },
      { key: "-M4GN2_ESiauto42s2ql", categoria: "Perfumería", inventario: 25, nroprod: 2, preciocom: 10 },
      { key: "-M4GNOglrhfB5-Cp--Ty", categoria: "Galletitas", inventario: 20, nroprod: 3, preciocom: 35 },
      { key: "-M4GNe8cA_DftE9rUpHq", categoria: "Galletitas ", inventario: 5, nroprod: 4, preciocom: 30 },
      { key: "-M4GQvtAM0kK_NP_n354", categoria: "Golosinas", inventario: 20, nroprod: 5, preciocom: 20 },
      { key: "-M4pMQQdi-l3CIxvN_uI", categoria: "juguetes", inventario: 10, nroprod: 6, preciocom: 50 },
    ];
    // console.log(csvData);
    //  let cvsString = JSON.stringify(csvData);
    //  console.log(cvsString);
    csvData.forEach((items, i) => {
      this.testValues.push(Object.values(items));
      //console.log(this.testValues);
      if (i == 1) {
        this.testHeaders = Object.keys(items);
      }
    });

    // console.log(res);
    // tslint:disable-next-line:prefer-const
    let cvsString = res || '';

    this.papa.parse(cvsString, {
      complete: parsedData => {
        //  console.log(`${parsedData.data} this is the parsedData`);
        //    this.headerRow = this.testHeaders;
        // console.log(this.testValues);
        // this.csvData = this.testValues;
        console.log(this.csvData);
        this.headerRow = parsedData.data.splice(0, 1)[0];
        console.log(this.headerRow);
        this.csvData = parsedData.data;
        //     console.log(this.csvData);
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
    // console.log(item);
    //  console.log(index);
    return index;
  }

}

