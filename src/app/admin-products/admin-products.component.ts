import { PizzaService } from './../services/pizza-service.service';
import { PizzaInterface } from './../Models/Pizza.interface';
import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as data from '../Stored-Data.json';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  dataLoaded: boolean = false;
  editMode: boolean = false;
  isSubmitted: boolean = false;
  pizzas: PizzaInterface[] = [];
  searchedPizza: PizzaInterface[];
  selectedItem: PizzaInterface;

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  form: FormGroup = new FormGroup({
    Code: new FormControl(null, [Validators.required]),
    Name: new FormControl(null, [Validators.required]),
    Price: new FormControl(null, [Validators.required, Validators.min(0)]),
    Quantity: new FormControl(null, [Validators.required, Validators.min(0)]),
    Image: new FormControl(null, [Validators.required]),
  });
  constructor(
    private pizzaService: PizzaService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private toasterService: ToastrService
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'xl';
    config.scrollable = true;
    config.centered = true;
  }

  get CodeInput() {
    return this.form.controls.Code;
  }
  get NameInput() {
    return this.form.controls.Name;
  }
  get PriceInput() {
    return this.form.controls.Price;
  }
  get ImageInput() {
    return this.form.controls.Image;
  }
  get QuantityInput() {
    return this.form.controls.Quantity;
  }
  ngOnInit(): void {
    this.getallPizza();
  }

  getallPizza() {
    setTimeout(() => {
      this.dataLoaded = true;
      this.pizzas = this.pizzaService.getAllData();
      this.searchedPizza = this.pizzaService.getAllData();
      let pizzas2: any[] = this.pizzaService.getAllData();
      this.pizzas = pizzas2
        .map((country, i) => ({ id: i + 1, ...country }))
        .slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize
        );
      this.collectionSize = this.searchedPizza.length;
    }, 1000);
  }
  open(content, item: PizzaInterface = null) {
    this.modalService.open(content);
    if (item) {
      this.selectedItem = item;
      this.editMode = true;
      this.CodeInput.setValue(item.Code);
      this.NameInput.setValue(item.Name);
      this.PriceInput.setValue(item.Price);
      this.ImageInput.setValue(item.Image);
      this.QuantityInput.setValue(item.Quantity);
    } else {
      this.editMode = false;
      this.CodeInput.setValue(this.pizzas.length + 1);
    }
  }
  openDelete(content, item) {
    this.selectedItem = item;
    this.modalService.open(content);
  }
  confirmDelete() {
    this.dataLoaded = false;
    this.pizzaService.deleteData(this.selectedItem.Code);
    this.getallPizza();
    this.toasterService.success(
      'Pizza Deleted Successfully',
      'Successfull Process'
    );
    this.modalService.dismissAll();
  }
  onSubmit() {
    if (this.form.valid) {
      this.isSubmitted = false;
      if (!this.editMode) {
        this.pizzaService.addNewData(this.form.value);
        this.getallPizza();
        this.toasterService.success(
          'Pizza Added Successfully',
          'Successfull Process'
        );
      } else {
        this.pizzaService.editData(this.selectedItem.Code, this.form.value);
        this.getallPizza();
        this.toasterService.success(
          'Pizza Edited Successfully',
          'Successfull Process'
        );
      }
      this.form.reset();
      this.modalService.dismissAll();
    } else {
      this.isSubmitted = true;
      this.toasterService.error(
        'You Must Fill The Form Correctly',
        'Failed Process'
      );
    }
  }

  search(key: string) {
    this.pizzas = this.searchedPizza.filter((element) => {
      return element.Name.toLowerCase().includes(key.toLowerCase());
    });
  }
}
