import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SeccionesComponent } from './features/secciones/secciones.component';

export const routes: Routes = [  // Asegúrate de exportar 'routes'
  { path: '', component: HomeComponent },
  { path: 'secciones', component: SeccionesComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

