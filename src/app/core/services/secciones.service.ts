import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeccionesService {

  private apiUrl = 'http://localhost:3000/api/secciones'; // URL del backend

  constructor(private http: HttpClient) { }

  // Obtener todas las secciones
  getSecciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Editar una sección (puedes adaptar el cuerpo según sea necesario)
  editSeccion(id: number, seccion: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, seccion);
  }

  // Eliminar una sección
  deleteSeccion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
