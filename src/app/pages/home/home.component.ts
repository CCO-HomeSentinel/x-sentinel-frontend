import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DomSanitizer } from '@angular/platform-browser';
import { ResidenciaService } from '../../services/residencia/residencia.service';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { SheetService } from '../../services/sheet/sheet.service';
import { response } from 'express';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardModule, CalendarModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  selectedDate!: Date;
  cidade!: string;
  user_id!: string;
  ano: number = 2023;
  mes: string = 'Dezembro';
  urlDashboard!: any;
  urlSheets!: any;

  constructor(
    private sanitizer: DomSanitizer,
    private residenciaService: ResidenciaService,
    private sheetService: SheetService
  ) { }

  ngOnInit() {
    this.selectedDate = new Date();
    this.updateDate(this.selectedDate);
    this.user_id = localStorage.getItem('id')?.toString() || '';
    this.getResidencias();
  }

  setUrlDashboard() {
    this.urlDashboard = this.sanitizer.bypassSecurityTrustResourceUrl(
      `http://ec2-54-175-142-82.compute-1.amazonaws.com/public/dashboard/cf3d764e-c5c7-49dd-a2b5-bddff0a710ef?cidade=${this.cidade}&user_id=${this.user_id}&ano=${this.ano}&mes=${this.mes}#hide_parameters=cidade,user_id,ano,mes`
    );
  }

  setUrlSheets(cidade: string) {
    console.log(cidade)
    this.sheetService.getUrl(cidade).then(response => {
      if (response) {
        console.log(response)
        this.urlSheets = this.sanitizer.bypassSecurityTrustResourceUrl(response.url);
      }
    }).catch(err => {
      console.log('Erro ao buscar o sheet:', err);
    });
    
  }

  updateDate(event: Date) {
    const opcoes = { month: 'long' } as const;
    this.mes = event.toLocaleDateString('pt-BR', opcoes);
    this.ano = event.getFullYear();
    this.setUrlDashboard();
  }

  getResidencias() {
    this.residenciaService.getResidencias(this.user_id).then(response => {
      if (response) {
        console.log('Residencias buscadas com sucesso');
        console.log(response.message)
        this.cidade = response.message[1].cidade
        this.setUrlDashboard();
        this.setUrlSheets(response.message[1].cidade);
      }
    }).catch(err => {
      console.log('Erro ao buscar as residencias:', err);
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Bom dia!';
    } else if (hour < 18) {
      return 'Boa tarde!';
    } else {
      return 'Boa noite!';
    }
  }

}
