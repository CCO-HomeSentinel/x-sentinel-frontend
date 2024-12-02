import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  apiUrl: string = "https://script.google.com/macros/s/AKfycbx7L0vIHd8afYdniQ0kO4e4Ef9zLb0-VQ0T9zUeDJV9pxAjbaJs-dZ6hkPaqXftjKJA/exec"

  constructor(private http: HttpClient) {}

  getUrl(cidade: string): Promise<any> {
    // Fazendo a requisição HTTP para o Google Apps Script
    const url = `${this.apiUrl}?cidade=${cidade}`;
    
    // Fazendo a requisição GET
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (response: any) => {
          resolve(response);
        },
        (error: any) => {
          console.error('Erro ao buscar o sheet:', error);
          reject(false);
        }
      );
    });
  }
}
