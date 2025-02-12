import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Match {
  idEquipo: number;
  fecha: string;
  local: string;
  team1: string;
  rival: string;
}

interface Seccion {
  id: number;
  nombre: string;
}

interface Equipo {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
})
export class CalendarioComponent implements OnInit {
  currentMonth: Date;
  calendarWeeks: { weekNumber: number; days: (Date | null)[] }[] = [];
  daysOfWeek: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  secciones: Seccion[] = [];
  equipos: Equipo[] = [];
  partidos: Match[] = [];
  newMatch: Match = {
    idEquipo: 0,
    local: 'Local',
    team1: '',
    rival: '',
    fecha: '',
  };

  isFormVisible = false;
  isModalVisible = false; // Controla la visibilidad del modal
  selectedDate: string = ''; // Fecha seleccionada
  selectedPartidos: Match[] = []; // Partidos del día seleccionado

  constructor(private http: HttpClient) {
    this.currentMonth = new Date();
  }

  ngOnInit(): void {
    this.cargarSecciones();
    this.cargarPartidos();
  }

  cargarSecciones(): void {
    this.http.get<Seccion[]>('http://localhost:3000/api/secciones').subscribe(
      (data) => {
        this.secciones = data.map((seccion: any) => ({
          id: seccion.Id,
          nombre: seccion.Seccion,
        }));
        console.log('Secciones cargadas:', this.secciones);
      },
      (error) => {
        console.error('Error al obtener las secciones:', error);
      }
    );
  }

  loadEquiposPorSeccion(idSeccion: number): void {
    this.http
      .get<Equipo[]>(`http://localhost:3000/api/equipos/${idSeccion}`)
      .subscribe(
        (data) => {
          this.equipos = data.map((equipo: any) => ({
            id: equipo.Id,
            nombre: equipo.Equipo,
          }));
          console.log('Equipos cargados para la sección:', this.equipos);
        },
        (error) => {
          console.error('Error al obtener los equipos:', error);
        }
      );
  }

  openCreateMatchForm(): void {
    this.isFormVisible = true;
    this.newMatch = {
      idEquipo: 0,
      local: 'Local',
      team1: '',
      rival: '',
      fecha: '',
    };
    this.equipos = [];
  }

  closeCreateMatchForm(): void {
    this.isFormVisible = false;
  }

  submitForm(): void {
    if (
      !this.newMatch.rival ||
      !this.newMatch.fecha ||
      !this.newMatch.idEquipo
    ) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const localBoolean = this.newMatch.local === 'Local' ? 0 : 1;
    const partido = {
      idEquipo: this.newMatch.idEquipo,
      local: localBoolean,
      rival: this.newMatch.rival,
      fecha: this.newMatch.fecha,
    };

    this.http.post('http://localhost:3000/api/partidos', partido).subscribe(
      (response) => {
        console.log('Partido creado:', response);
        alert('Partido añadido al calendario.');
        this.cargarPartidos();
        this.closeCreateMatchForm();
      },
      (error) => {
        console.error('Error al crear el partido:', error);
      }
    );
  }

  cargarPartidos(): void {
    this.http.get<any>(`http://localhost:3000/api/partidos`).subscribe(
      (data) => {
        this.partidos = data.map((partido: any) => ({
          fecha: this.formatDateLocal(new Date(partido.Fecha)),
          local: partido.local,
          team1: partido.equipoClub,
          rival: partido.Rival,
        }));
        console.log('Partidos cargados:', this.partidos);
        this.generateCalendar();
      },
      (error) => {
        console.error('Error al obtener los partidos:', error);
      }
    );
  }

  generateCalendar() {
    const firstDayOfMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      0
    );
    const firstDayWeekday = firstDayOfMonth.getDay();

    const firstDayAdjusted = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
    const totalDays = lastDayOfMonth.getDate();

    this.calendarWeeks = [];
    let currentWeek: (Date | null)[] = [];

    for (let i = 0; i < firstDayAdjusted; i++) {
      currentWeek.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      currentWeek.push(
        new Date(
          this.currentMonth.getFullYear(),
          this.currentMonth.getMonth(),
          i
        )
      );

      if (currentWeek.length === 7) {
        this.calendarWeeks.push({
          weekNumber: this.calendarWeeks.length + 1,
          days: currentWeek,
        });
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      this.calendarWeeks.push({
        weekNumber: this.calendarWeeks.length + 1,
        days: currentWeek,
      });
    }
  }

  changeMonth(direction: number) {
    this.currentMonth = new Date(
      this.currentMonth.setMonth(this.currentMonth.getMonth() + direction)
    );
    this.generateCalendar();
  }

  formatDateLocal(date: Date | null): string {
    if (!date) return '';
    return (
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0')
    );
  }

  hasMatch(date: Date | null): boolean {
    if (!date) return false;
    const formattedDate = this.formatDateLocal(date);
    return this.partidos.some((partido) => partido.fecha === formattedDate);
  }

  onDayClick(date: Date | null) {
    if (!date) return;

    const formattedDate = this.formatDateLocal(date);
    this.selectedPartidos = this.partidos.filter(
      (p) => p.fecha === formattedDate
    );

    if (this.selectedPartidos.length > 0) {
      this.selectedDate = formattedDate;
      this.isModalVisible = true;
    } else {
      alert(`No hay partidos el ${formattedDate}`);
    }
  }

  closeModal() {
    this.isModalVisible = false;
  }

  verEstadisticas(partido: Match) {
    alert(`Mostrar estadísticas para: ${partido.team1} vs ${partido.rival}`);
  }
}
