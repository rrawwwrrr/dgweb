import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskComponent } from './tasks';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';

const routes: Routes = [
  { path: '', component: TaskComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TaskComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
