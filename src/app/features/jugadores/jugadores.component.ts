import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  // Importa Router
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { DataService } from '../../core/services/data.service';
@Component({
  selector: 'app-jugadores',
  imports: [FormsModule,CommonModule,TableComponent, HttpClientJsonpModule],
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css']
})
export class JugadoresComponent implements OnInit {
  equipoId: number | null = null; // Declaramos el sectionId aquí
  seccionId: number | null = null; // Declaramos el sectionId aquí

  jugadoresData: any[] = [];
  columns: string[] = ['id', 'equipo', 'jugador', 'numero'];  
  actions = ['Seleccionar', 'Editar', 'Eliminar'];
  seccionName: string = '';  

  equipoName: string = '';  
  selectedJugadorId: number | null = null;

  mostrarVentana = false;
  nuevoJugador = { nombre: '', numero: ''};
  jugadorEditar: any = null;
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    // Obtener el 'id' de los parámetros de la URL
      this.equipoId = this.dataService.getEquipoId();
      this.seccionId = this.dataService.getSeccionId();
      // Convierte el parámetro a número
      this.cargarSeccion();
      this.cargarEquipo();  
      this.cargarJugadores();
  }

  cargarJugadores(): void {
    if (this.equipoId !== null) {
      this.http.get<any[]>(`http://localhost:3000/api/jugadores/${this.equipoId}`).subscribe(
        data => {
          this.jugadoresData = data.map(jugador => {
            const { Id, equipoName, Jugador, Número } = jugador;
            return {
              id: Id,
              equipo: this.equipoName, // Usamos el nombre del equipo ya cargado en `cargarEquipo`
              jugador: Jugador,
              numero: Número,
            };
          });
          console.log('Jugadores:', this.jugadoresData);
        },
        error => {
          console.error('Error al obtener jugadores:', error);
        }
      );
    }
  }
  
  cargarSeccion(): void {
    if (this.seccionId !== null) {
      this.http.get<any>(`http://localhost:3000/api/secciones/${this.seccionId}`).subscribe(
        data => {
          this.seccionName = data.Seccion;  // Asignar el nombre de la sección
          console.log('Nombre de la sección:', this.seccionName);
        },
        error => {
          console.error('Error al obtener la sección:', error);
        }
      );
    }
  }

  cargarEquipo(): void {
    console.log("ha entrao");
    if (this.equipoId !== null) {
      this.http.get<any>(`http://localhost:3000/api/equiposJugador/${this.equipoId}`).subscribe(
        data => {
          this.equipoName = data.Equipo; // Supongo que "Equipo" es el nombre del equipo
          console.log('Nombre del equipo:', this.equipoName);
        },
        error => {
          console.error('Error al obtener el equipo:', error);
        }
      );
    }
  }
  

  onDelete(row: any): void {
    console.log('Eliminando jugador con id:', row.id);

    this.http.delete(`http://localhost:3000/api/jugadores/${row.id}`).subscribe(
      response => {
        console.log('Sección eliminada', response);
        this.jugadoresData = this.jugadoresData.filter(item => item.id !== row.id);
      },
      error => {
        console.error('Error al eliminar el equipo', error);
      }
    );
  }

  onSelect(row: any): void {}


  onEdit(row: any): void {
    this.jugadorEditar = { ...row }; // Copiar los datos de la fila para la edición
    this.nuevoJugador.nombre = this.jugadorEditar.jugador; 
    console.log(this.jugadorEditar.jugador);
    this.nuevoJugador.numero = this.jugadorEditar.numero;
    console.log(this.jugadorEditar.numero);// Asignar el nombre de la sección al input
    this.mostrarVentana = true; // Mostrar el modal
  }

  volverAEquipos(): void {
    this.router.navigate(['/equipos', this.dataService.getSeccionId()]); // Cambia esta ruta si es diferente
  }

  cerrarVentana(): void {
    this.mostrarVentana = false; // Cerrar el modal
    this.nuevoJugador = { nombre: '', numero:'' }; // Limpiar el formulario
    this.jugadorEditar = null; // Limpiar sección en edición
  }
  abrirVentana(): void{
    this.mostrarVentana = true;
  }

  crearJugador(): void{
    if (!this.nuevoJugador.nombre || !this.nuevoJugador.numero) {
      alert('Por favor, introduce un nombre y numero para el jugador.');
      return;
    }
  
    // Asegúrate de que 'sectionId' esté disponible
    if (this.equipoId === null) {
      alert('No se ha encontrado el equipo para el jugador.');
      return;
    }
  
    // Enviar nombre y seccionId al backend
    const jugadorData = {
      nombre: this.nuevoJugador.nombre,
      numero: this.nuevoJugador.numero,
      equipoId: this.equipoId  // Usamos el sectionId ya disponible
    };

    console.log(jugadorData);
  
    // Llamada al backend para crear el nuevo equipo
    this.http.post('http://localhost:3000/api/jugadores', jugadorData).subscribe(
      (response: any) => {
        console.log('Jugador creado:', response);
        this.cargarEquipo();
        this.cargarJugadores(); // Recargar los equipos después de crear uno nuevo
        this.cerrarVentana(); // Cerrar la ventana de creación
      },
      error => {
        console.error('Error al añadir el jugador:', error);
      }
    );
  }

  editarJugador():void{
    if (!this.nuevoJugador.nombre) {
      alert('Por favor, introduce un nombre para el equipo.');
      return;
    }

    // Llamada al backend para actualizar la sección
    this.http.put(`http://localhost:3000/api/jugadores/${this.jugadorEditar.id}`, this.nuevoJugador).subscribe(
      (response: any) => {
        console.log('Equipo editada:', response);
        this.cargarEquipo();
        this.cargarJugadores(); // Recargar las secciones
        this.cerrarVentana();
      },
      error => {
        console.error('Error al editar el jugador:', error);
      }
    );
  }

  volverASecciones(): void {
    this.router.navigate(['/secciones']); // Esto redirige a la ruta de las secciones
  }
}

