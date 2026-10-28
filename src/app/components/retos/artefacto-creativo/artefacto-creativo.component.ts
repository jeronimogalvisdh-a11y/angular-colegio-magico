import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Hechizo {
  id: number;
  nombre: string;
  costoEnergia: number;
  descripcion: string;
  poder: number;
  tipo: 'Daño' | 'Curación';
}

interface HistorialEntry {
  turno: number;
  emisor: string;
  hechizo: string;
  efecto: string;
  tipo: 'ataque' | 'cura';
}

@Component({
  selector: 'app-artefacto-creativo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artefacto-creativo.component.html',
  styleUrl: './artefacto-creativo.component.css'
})
export class ArtefactoCreativoComponent implements OnInit, OnDestroy {
  // Estados y Configuración
  arenaOscura: boolean = false;
  estadoDuelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA' = 'PREPARACION';
  numeroTurno: number = 1;

  // Datos de combate
  nombreMago: string = 'Tu Nombre Mago';
  nombreRival: string = 'Draco Malfoy';
  saludMago: number = 100;
  energiaMago: number = 100;
  saludRival: number = 100;
  energiaRival: number = 100;

  // Inventario de hechizos
  hechizosDuelo: Hechizo[] = [];
  historialDuelo: HistorialEntry[] = [];

  ngOnInit(): void {
    this.iniciarDuelo();
    this.hechizosDuelo = [
      { id: 1, nombre: 'Expelliarmus', costoEnergia: 15, descripcion: 'Desarma y daña levemente.', poder: 10, tipo: 'Daño' },
      { id: 2, nombre: 'Stupefy', costoEnergia: 25, descripcion: 'Aturdimiento potente.', poder: 20, tipo: 'Daño' },
      { id: 3, nombre: 'Episkey', costoEnergia: 20, descripcion: 'Cura heridas leves.', poder: 15, tipo: 'Curación' }
    ];
  }

  ngOnDestroy(): void {
    console.log("Desmontando el campo de duelo...");
  }

  toggleArena(): void {
    this.arenaOscura = !this.arenaOscura;
  }

  iniciarDuelo(): void {
    this.estadoDuelo = 'PREPARACION';
    this.saludMago = 100;
    this.energiaMago = 100;
    this.saludRival = 100;
    this.energiaRival = 100;
    this.numeroTurno = 1;
    this.historialDuelo = [];
  }

  comenzarCombate(): void {
    this.estadoDuelo = 'EN_CURSO';
  }

  lanzarHechizo(hechizo: Hechizo): void {
    if (this.estadoDuelo !== 'EN_CURSO' || this.energiaMago < hechizo.costoEnergia) return;

    // 1. Accion del Jugador
    this.energiaMago -= hechizo.costoEnergia;
    
    if (hechizo.tipo === 'Daño') {
      this.saludRival = Math.max(0, this.saludRival - hechizo.poder);
    } else {
      this.saludMago = Math.min(100, this.saludMago + hechizo.poder);
    }

    this.agregarAlHistorial(this.nombreMago, hechizo, hechizo.tipo === 'Daño' ? 'ataque' : 'cura');

    // 2. Verificar Victoria
    if (this.saludRival <= 0) {
      this.estadoDuelo = 'VICTORIA';
      return;
    }

    // 3. Turno del Rival (Simple IA)
    this.ejecutarTurnoRival();
  }

  ejecutarTurnoRival(): void {
    this.numeroTurno++;
    const poderRival = 15;
    this.saludMago = Math.max(0, this.saludMago - poderRival);
    
    this.historialDuelo.unshift({
      turno: this.numeroTurno,
      emisor: this.nombreRival,
      hechizo: 'Sectumsempra',
      efecto: `Causa ${poderRival} de daño`,
      tipo: 'ataque'
    });

    if (this.saludMago <= 0) {
      this.estadoDuelo = 'DERROTA';
    }
  }

  agregarAlHistorial(emisor: string, h: Hechizo, tipo: 'ataque' | 'cura'): void {
    this.historialDuelo.unshift({
      turno: this.numeroTurno,
      emisor: emisor,
      hechizo: h.nombre,
      efecto: `${h.tipo} de ${h.poder}`,
      tipo: tipo
    });
  }
}
