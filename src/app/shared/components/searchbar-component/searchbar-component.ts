import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './searchbar-component.html',
  styleUrl: './searchbar-component.css'
})
export class SearchbarComponent {

  constructor() { }

  @Input() placeholder: string = 'Buscar...';
  @Output() buscar = new EventEmitter<string>();
  @Output() limpiar = new EventEmitter<void>();

  termino: string = '';

  onBuscar(): void {    
    this.buscar.emit(this.termino);
  }

  onLimpiar(): void {
    this.termino = '';
    this.limpiar.emit();
  }

}
