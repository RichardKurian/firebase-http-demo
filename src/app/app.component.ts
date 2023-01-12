import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component,OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {map} from 'rxjs/operators';
import { product } from './model/products';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'firebase-http';
  allProducts:any=[];
  isFetching:boolean=false;

  // i have used this here just to reset the form
  @ViewChild('productsForm') form:NgForm;

  constructor(private http:HttpClient){}

  ngOnInit(): void {
    this.fetchProducts();
  }

  onProductsFetch(){
    this.fetchProducts();
  }

  onProductCreate(products:{pName:string, desc:string, price:string}){
    console.log(products);



    // how to add custom headers
    const headers = new HttpHeaders({'myHeader':'rapidvalue'})

    this.http.post('https://angular-http-74b98-default-rtdb.firebaseio.com/products.json',products,{headers:headers})
    .subscribe((res)=>{
      console.log(res);
     
     
    })
    // was able to use beasue of view child decarator
       this.form.reset();
  }

  private fetchProducts(){
    this.isFetching=true;
    this.http.get<{[key:string]:product}>('https://angular-http-74b98-default-rtdb.firebaseio.com/products.json')
    .pipe(map((res)=>{
      const products=[];
      for(const key in res){
        if(res.hasOwnProperty(key)){
          products.push({...res[key],id:key});
        }
       
      }
      return products;
    }))
    
    .subscribe((products)=>{
      console.log(products);
      this.allProducts=products;
      this.isFetching=false;
    })
  }

  onDeleteProduct(id:string){
    this.http.delete('https://angular-http-74b98-default-rtdb.firebaseio.com/products/'+id+'.json')
    .subscribe();
  }

  onDeleteAllProducts(){
    this.http.delete('https://angular-http-74b98-default-rtdb.firebaseio.com/products/.json')
    .subscribe();
  }

}
