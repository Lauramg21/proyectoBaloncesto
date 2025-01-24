import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components/table/table.component';
import { EquiposComponent } from '../equipos/equipos.component';

@Component({
  selector: 'app-secciones',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TableComponent, EquiposComponent],
  templateUrl: './secciones.component.html',
  styleUrls: ['./secciones.component.css']
})
export class SeccionesComponent implements OnInit {
  seccionesData: any[] = [];
  columns: string[] = ['id', 'seccion'];
  actions: string[] = ['Seleccionar', 'Editar', 'Eliminar'];
  selectedSectionId: number | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/secciones').subscribe(data => {
      this.seccionesData = data;
    });
  }

  onEdit(row: any): void {
    console.log('Editar:', row);
  }

  onDelete(row: any): void {
    console.log('Eliminando sección con id:', row.Id);  // Asegúrate de usar el campo correcto (id o Id)
    this.http.delete(`http://localhost:3000/api/secciones/${row.Id}`).subscribe(
      response => {
        console.log('Sección eliminada', response);
        this.seccionesData = this.seccionesData.filter(item => item.Id !== row.Id);  // Asegúrate de que el campo sea 'id'
      },
      error => {
        console.error('Error al eliminar la sección', error);
      }
    );
  }

  onSelect(row: any): void {
    console.log('Sección seleccionada:', row);
    this.selectedSectionId = row.id;  // Asegúrate de que sea 'id' o 'Id' según corresponda
  }
}
