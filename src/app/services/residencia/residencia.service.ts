import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Residencia } from '../../interfaces/residencia';

@Injectable({
  providedIn: 'root'
})
export class ResidenciaService {

  private url = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getResidencias(user_id: any): Promise<Residencia[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.url}/residencia?user_id=${user_id}`).subscribe(
        (response: any) => {
          resolve(response);
        },
        (error: any) => {
          console.error('Erro ao buscar residências:', error);
          reject(false);
        }
      );
    });
  }
}
