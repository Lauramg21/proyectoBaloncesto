import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() actions: string[] = [];

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() select = new EventEmitter<any>(); // Aquí está el evento select

  // Función para obtener las claves de un objeto
  getObjectKeys(row: any): string[] {
    return Object.keys(row);
  }

  // Emisión de evento de edición
  onEdit(item: any) {
    this.edit.emit(item);
  }

  // Emisión de evento de selección (corregido)
  onSelect(item: any) {
    this.select.emit(item);  // Emite el evento 'select' correctamente
  }

  // Emisión de evento de eliminación
  onDelete(item: any) {
    this.delete.emit(item);
  }
}
