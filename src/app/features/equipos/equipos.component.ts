import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableComponent } from '../../components/table/table.component'; // Asegúrate de que la ruta sea correcta
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-equipos',
  imports: [TableComponent,CommonModule], // Agrega TableComponent en los imports
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {
  @Input() sectionId: number | null = null;
  equiposData: any[] = [];
  columns: string[] = ['id', 'idSeccion', 'equipo'];
  actions = ['Seleccionar', 'Editar', 'Eliminar'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.sectionId !== null) {
      this.http.get<any[]>(`http://localhost:3000/api/equipos/${this.sectionId}`).subscribe(
        data => {
          this.equiposData = data;
          console.log('Equipos:', data);
        },
        error => {
          console.error('Error al obtener equipos:', error);
        }
      );
    }
  }
}
