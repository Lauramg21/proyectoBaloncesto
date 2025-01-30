import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para usar ngModel
import { TableComponent } from '../../components/table/table.component';
import { EquiposComponent } from '../equipos/equipos.component';
import { Router } from '@angular/router';  // Importa Router
import { DataService } from '../../core/services/data.service';
@Component({
  selector: 'app-secciones',
  imports: [CommonModule, HttpClientModule, FormsModule, TableComponent, EquiposComponent],
  templateUrl: './secciones.component.html',
  styleUrls: ['./secciones.component.css']
})
export class SeccionesComponent implements OnInit {
  seccionesData: any[] = [];
  columns: string[] = ['id', 'seccion'];
  actions: string[] = ['Seleccionar', 'Editar', 'Eliminar'];
  selectedSectionId: number | null = null;

  // Estados para el modal y la nueva sección
  mostrarVentana = false;
  nuevaSeccion = { nombre: '' };
  seccionEditar: any = null; // Nuevo estado para la sección a editar

  constructor(private http: HttpClient, private router: Router,private dataService: DataService ) { } // Inyecta Router

  ngOnInit(): void {
    // Obtener las secciones al cargar el componente
    this.cargarSecciones();
  }

  abrirVentana(): void {
    this.mostrarVentana = true; // Mostrar el modal
  }

  cerrarVentana(): void {
    this.mostrarVentana = false; // Cerrar el modal
    this.nuevaSeccion = { nombre: '' }; // Limpiar el formulario
    this.seccionEditar = null; // Limpiar sección en edición
  }

  // Función para crear una nueva sección
  crearSeccion(): void {
    if (!this.nuevaSeccion.nombre) {
      alert('Por favor, introduce un nombre para la sección.');
      return;
    }

    // Llamada al backend para crear la nueva sección
    this.http.post('http://localhost:3000/api/secciones', this.nuevaSeccion).subscribe(
      (response: any) => {
        console.log('Sección creada:', response);
        this.cargarSecciones(); // Vuelve a cargar las secciones después de crear una nueva
        this.cerrarVentana();
      },
      error => {
        console.error('Error al crear la sección:', error);
      }
    );
  }

  // Función para cargar las secciones
  cargarSecciones(): void {
    this.http.get<any[]>('http://localhost:3000/api/secciones').subscribe(data => {
      this.seccionesData = data; // Actualiza los datos con los del servidor
    });
  }

  // Función para abrir la ventana de edición y cargar los datos de la sección
  onEdit(row: any): void {
    this.seccionEditar = { ...row }; // Copiar los datos de la fila para la edición
    this.nuevaSeccion.nombre = this.seccionEditar.Seccion; // Asignar el nombre de la sección al input
    this.mostrarVentana = true; // Mostrar el modal
  }

  // Función para guardar la edición de la sección
  editarSeccion(): void {
    if (!this.nuevaSeccion.nombre) {
      alert('Por favor, introduce un nombre para la sección.');
      return;
    }

    // Llamada al backend para actualizar la sección
    this.http.put(`http://localhost:3000/api/secciones/${this.seccionEditar.Id}`, this.nuevaSeccion).subscribe(
      (response: any) => {
        console.log('Sección editada:', response);
        this.cargarSecciones(); // Recargar las secciones
        this.cerrarVentana();
      },
      error => {
        console.error('Error al editar la sección:', error);
      }
    );
  }

  onDelete(row: any): void {
    console.log('Eliminando sección con id:', row.Id);
    this.http.delete(`http://localhost:3000/api/secciones/${row.Id}`).subscribe(
      response => {
        console.log('Sección eliminada', response);
        this.seccionesData = this.seccionesData.filter(item => item.Id !== row.Id);
      },
      error => {
        console.error('Error al eliminar la sección', error);
      }
    );
  }

  onSelect(row: any): void {
    console.log('Sección seleccionada:', row);
    this.selectedSectionId = row.Id;
    this.dataService.setSeccionId(row.Id);

    this.router.navigate(['/equipos', this.selectedSectionId]);  // Navegar a la ruta de equipos
  }
}
