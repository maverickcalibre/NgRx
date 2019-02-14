import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription, Observable } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { Store, select, State } from '@ngrx/store';
import * as fromProduct from '../state/product.reducer';
import * as productActions from '../state/product.action'
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  errorMessage: Observable<string>;
  componentActive: boolean = true;

  displayCode: boolean;

  products: Product[];

  // Used to highlight the selected product in the list
  selectedProduct: Product | null;
  sub: Subscription;  
  products$: Observable<Product[]>;
  errorMessage$: Observable<string>;

  constructor(private productService: ProductService,
    private store: Store<fromProduct.State>) { }

  ngOnInit(): void {
    //TODO: Unsubscribe
    this.store.pipe(select(fromProduct.getCurrentProduct),
      takeWhile(()=>this.componentActive))
      .subscribe(selectedProduct => this.selectedProduct = selectedProduct);

    this.errorMessage$ = this.store.pipe(select(fromProduct.getError));

    this.store.dispatch(new productActions.Load());
    // this.store.pipe(select(fromProduct.getProducts),
    //   takeWhile(()=>this.componentActive))
    //   .subscribe((products: Product[]) => this.products = products);
    this.products$ = this.store.pipe(select(fromProduct.getProducts));
    // this.productService.getProducts().subscribe(
    //   (products: Product[]) => this.products = products,
    //   (err: any) => this.errorMessage = err.error
    // );

    //TODO: Unsubscribe
    this.store.pipe(select(fromProduct.getShowProductCode),
      takeWhile(()=>this.componentActive)).subscribe(
      showProductCode => {
        this.displayCode = showProductCode;
      }
    );
  }

  //TODO: Unsubscribe
  ngOnDestroy(): void {
    this.componentActive = false;
  }

  checkChanged(value: boolean): void {
    this.store.dispatch(new productActions.ToggleProductCode(value));
  }

  newProduct(): void {
    //this.productService.changeSelectedProduct(this.productService.newProduct());
    this.store.dispatch(new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    this.store.dispatch(new productActions.SetCurrentProduct(product));
  }

}
