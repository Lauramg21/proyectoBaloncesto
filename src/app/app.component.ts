import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './layouts/navbar/navbar.component';  // Asegúrate de importar
import { FooterComponent } from './layouts/footer/footer.component';  // Asegúrate de importar

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterModule, NavbarComponent, FooterComponent]  // Agrega los componentes aquí
})
export class AppComponent {}

