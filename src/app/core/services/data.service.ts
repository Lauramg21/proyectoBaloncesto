import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private seccionId: number | null = null;
  private equipoId: number | null = null;

  constructor() { }

  // Método para obtener el seccionId
  getSeccionId(): number | null {
    return this.seccionId;
  }

  // Método para guardar el seccionId
  setSeccionId(id: number): void {
    this.seccionId = id;
  }

  // Método para obtener el equipoId
  getEquipoId(): number | null {
    return this.equipoId;
  }

  // Método para guardar el equipoId
  setEquipoId(id: number): void {
    this.equipoId = id;
  }
}
