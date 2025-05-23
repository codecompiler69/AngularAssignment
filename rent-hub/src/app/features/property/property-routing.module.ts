import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePropertyComponent } from './components/create-property/create-property.component';
import { PreviewPropertyComponent } from './components/preview-property/preview-property.component';
import { AuthGuard } from '../../core/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'create', pathMatch: 'full' },
  {
    path: 'create',
    component: CreatePropertyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'preview/:id',
    component: PreviewPropertyComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyRoutingModule {}
