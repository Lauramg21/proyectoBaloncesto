import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SeccionesComponent } from './features/secciones/secciones.component';
import { EquiposComponent } from './features/equipos/equipos.component';
import { JugadoresComponent } from './features/jugadores/jugadores.component';
export const routes: Routes = [  // Asegúrate de exportar 'routes'
  { path: '', component: HomeComponent },
  { path: 'secciones', component: SeccionesComponent },
  { path: 'equipos/:id', component: EquiposComponent },
  { path: 'jugadores/:id', component: JugadoresComponent },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

