import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';  // Importar ActivatedRoute
import { TableComponent } from '../../components/table/table.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  // Importa Router
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
@Component({
  selector: 'app-equipos',
  imports: [TableComponent, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {
  equiposData: any[] = [];
  columns: string[] = ['id', 'nombreSeccion', 'equipo'];  
  actions = ['Seleccionar', 'Editar', 'Eliminar'];
 
  sectionName: string = '';  
  sectionId: number | null = null; 
  
  selectedEquipoId: number | null = null;
 
  mostrarVentana = false;
  
  nuevoEquipo = { nombre: '' };
  equipoEditar: any = null;
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private dataService: DataService) {  console.log('Servicio inyectado:', dataService);
  }

  ngOnInit(): void {
    // Usamos ActivatedRoute para obtener el sectionId de la URL
      this.sectionId = this.dataService.getSeccionId();
      console.log(this.sectionId);// Aquí sacamos el id de la ruta y lo convertimos a número
      if (this.sectionId !== null) {      
        this.cargarSeccion();  // Primero obtenemos el nombre de la sección
        this.cargarEquipos();   // Luego cargamos los equipos
      }
    
  }

  cargarSeccion(): void {
    if (this.sectionId !== null) {
      this.http.get<any>(`http://localhost:3000/api/secciones/${this.sectionId}`).subscribe(
        data => {
          this.sectionName = data.Seccion;  // Asignar el nombre de la sección
          console.log('Nombre de la sección:', this.sectionName);
        },
        error => {
          console.error('Error al obtener la sección:', error);
        }
      );
    }
  }
  cargarEquipos(): void {
    if (this.sectionId !== null) {
      this.http.get<any[]>(`http://localhost:3000/api/equipos/${this.sectionId}`).subscribe(
        data => {
          this.equiposData = data.map(equipo => {
            const { IdSeccion, Id, Equipo } = equipo; // Desestructuramos los campos relevantes
            return {
              id: Id,              // Id equipo
              nombreSeccion: this.sectionName, // Nombre de la sección
              equipo: Equipo       // Nombre del equipo
            };
          });
          console.log('Equipos:', this.equiposData);
        },
        error => {
          console.error('Error al obtener equipos:', error);
        }
      );
    }
  }
  

  abrirVentana(): void{
    this.mostrarVentana = true;
  }

  cerrarVentana(): void {
    this.mostrarVentana = false; // Cerrar el modal
    this.nuevoEquipo = { nombre: '' }; // Limpiar el formulario
    this.equipoEditar = null; // Limpiar sección en edición
  }

  crearEquipo(): void {
    if (!this.nuevoEquipo.nombre) {
      alert('Por favor, introduce un nombre para el equipo.');
      return;
    }
  
    // Asegúrate de que 'sectionId' esté disponible
    if (this.sectionId === null) {
      alert('No se ha encontrado la sección para el equipo.');
      return;
    }
  
    // Enviar nombre y seccionId al backend
    const equipoData = {
      nombre: this.nuevoEquipo.nombre,
      seccionId: this.sectionId  // Usamos el sectionId ya disponible
    };
  
    // Llamada al backend para crear el nuevo equipo
    this.http.post('http://localhost:3000/api/equipos', equipoData).subscribe(
      (response: any) => {
        console.log('Equipo creado:', response);
        this.cargarSeccion();
        this.cargarEquipos(); // Recargar los equipos después de crear uno nuevo
        this.cerrarVentana(); // Cerrar la ventana de creación
      },
      error => {
        console.error('Error al crear el equipo:', error);
      }
    );
  }
  

  onEdit(row: any): void {
    this.equipoEditar = { ...row }; // Copiar los datos de la fila para la edición
    this.nuevoEquipo.nombre = this.equipoEditar.equipo; 
    console.log(this.equipoEditar.equipo);// Asignar el nombre de la sección al input
    this.mostrarVentana = true; // Mostrar el modal
  }

  // Función para guardar la edición del equipo
  editarEquipo(): void {
    if (!this.nuevoEquipo.nombre) {
      alert('Por favor, introduce un nombre para el equipo.');
      return;
    }

    // Llamada al backend para actualizar la sección
    this.http.put(`http://localhost:3000/api/equipos/${this.equipoEditar.id}`, this.nuevoEquipo).subscribe(
      (response: any) => {
        console.log('Equipo editada:', response);
        this.cargarSeccion();
        this.cargarEquipos(); // Recargar las secciones
        this.cerrarVentana();
      },
      error => {
        console.error('Error al editar el equipo:', error);
      }
    );
  }

  onDelete(row: any): void {
    console.log('Eliminando equipo con id:', row.id);

    this.http.delete(`http://localhost:3000/api/equipos/${row.id}`).subscribe(
      response => {
        console.log('Sección eliminada', response);
        this.equiposData = this.equiposData.filter(item => item.id !== row.id);
      },
      error => {
        console.error('Error al eliminar el equipo', error);
      }
    );
  }

  onSelect(row: any): void {
    console.log('Equipo seleccionada:', row);
    this.selectedEquipoId = row.id;
    this.dataService.setEquipoId(row.id);
    this.router.navigate(['/jugadores', this.selectedEquipoId]);
  }

  volverASecciones(): void {
    this.router.navigate(['/secciones']); // Esto redirige a la ruta de las secciones
  }
  
  
}

