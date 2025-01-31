import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CalendarioComponent implements OnInit {
  currentMonth: Date;
  calendarWeeks: { weekNumber: number, days: (Date | null)[] }[] = [];
  daysOfWeek: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  constructor() { 
    // Inicializa el mes actual con la fecha de hoy
    this.currentMonth = new Date();
  }

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar() {
    // Genera el primer y último día del mes actual
    const firstDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    
    // El primer día de la semana del mes (domingo = 0, lunes = 1, etc.)
    const firstDayWeekday = firstDayOfMonth.getDay(); // Domingo = 0, Lunes = 1, etc.
    
    // Ajustamos para que el lunes sea el primer día de la semana
    const firstDayAdjusted = (firstDayWeekday === 0) ? 6 : firstDayWeekday - 1; // Ajuste para lunes = 0, ..., domingo = 6
    
    const totalDays = lastDayOfMonth.getDate();
    
    // Llenamos el calendario con semanas
    this.calendarWeeks = [];
    let currentWeek: (Date | null)[] = [];

    // Llenamos los días vacíos antes de que empiece el mes
    for (let i = 0; i < firstDayAdjusted; i++) {
      currentWeek.push(null); // Añadimos los días vacíos hasta el primer día del mes
    }

    // Añadimos los días del mes al calendario
    for (let i = 1; i <= totalDays; i++) {
      currentWeek.push(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i));
      
      // Si ya tenemos 7 días en la semana, los añadimos al calendario y comenzamos una nueva semana
      if (currentWeek.length === 7) {
        this.calendarWeeks.push({ weekNumber: this.calendarWeeks.length + 1, days: currentWeek });
        currentWeek = []; // Reiniciamos la semana
      }
    }

    // Si hay días restantes en la última semana, los añadimos
    if (currentWeek.length > 0) {
      this.calendarWeeks.push({ weekNumber: this.calendarWeeks.length + 1, days: currentWeek });
    }
  }

  changeMonth(direction: number) {
    // Cambia el mes y actualiza el calendario
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() + direction));
    this.generateCalendar();
  }
}
