import { CheckoutComponent } from './checkout/checkout.component';
import { StoreProductsComponent } from './store-products/store-products.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { MainViewComponent } from './main-view/main-view.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MainViewComponent,
  },
  {
    path: 'Admin-Products',
    component: AdminProductsComponent,
  },
  {
    path: 'Store-Products',
    component: StoreProductsComponent,
  },
  {
    path: 'Checkout',
    component: CheckoutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
