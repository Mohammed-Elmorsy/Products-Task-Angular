import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  providers: [MessageService]

})
export class ProductsListComponent implements OnInit {

  products: Product[] = [];
  displayEditProduct: boolean = false;
  productForm: FormGroup;

  get productName(): FormControl{
    return this.productForm.get('name') as FormControl; 
  }

  constructor(private productService: ProductsService, private formBuilder: FormBuilder,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      response => {
        this.products = response;
      },
      error => {
        alert('error from server');
        console.log('error getting products', error);
      }
    )
  }

  trackById(index: number, obj: any) {
    return obj.id;
  }

  showProductUpdateDialog(product: Product) {
    this.displayEditProduct = true;
    this.createProductForm(product);
  }

  createProductForm(product: Product) {
    this.productForm = this.formBuilder.group({
      id          : [product.id],
      name        : [product.name, Validators.required],
      imageURL    : [product.imageURL],
      description : [product.description]
    })
  }

  updateProduct() {
    this.productService.update(this.productForm.value).subscribe(
      res => {
        let productIndex = this.products.findIndex(product => product.id === this.productForm.value.id);
        if (productIndex > -1) {
          this.products[productIndex] = this.productForm.value;
        }
        this.messageService.add({key: 'product', severity:'success', summary: 'Updated', detail: 'Successfully updated product info'});
      },
      err => {
        this.messageService.add({key: 'product', severity:'error', summary: 'Failed', detail: 'Failed to update product info'});
      }
    )

    this.displayEditProduct = false;
  }

}
