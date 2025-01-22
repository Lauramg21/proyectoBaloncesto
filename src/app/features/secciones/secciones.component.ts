import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-secciones',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TableComponent],
  templateUrl: './secciones.component.html',
  styleUrls: ['./secciones.component.css']
})
export class SeccionesComponent implements OnInit {
  seccionesData: any[] = [];
  columns: string[] = ['id', 'seccion'];
  actions: string[] = ['Editar', 'Eliminar'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/secciones').subscribe(data => {
      this.seccionesData = data;
    });
  }

  onEdit(row: any): void {
    console.log('Editar:', row);
  }

  onDelete(row: any): void {
    console.log('Eliminar:', row);
  }

  onRowClick(row: any): void {
    console.log('Fila seleccionada:', row);
  }
}
