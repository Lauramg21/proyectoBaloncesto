import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HomeComponent } from './features/home/home.component';
import { SeccionesComponent } from './features/secciones/secciones.component';
import { TableComponent } from './components/table/table.component';
import { EquiposComponent } from './features/equipos/equipos.component';
import { DataService } from './core/services/data.service';
import { CalendarioComponent } from './features/calendario/calendario.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    SeccionesComponent,
    TableComponent,
    EquiposComponent,
    CalendarioComponent // Asegúrate de declarar tu componente
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
    ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
