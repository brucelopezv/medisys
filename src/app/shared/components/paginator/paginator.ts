import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css'
})
export class Paginator implements OnInit, OnChanges {

  @Input() paginador: any;
  @Input() url: string = '';
  @Output() paginaSeleccionada: EventEmitter<number> = new EventEmitter<number>();

  paginas: number[] = [];
  private readonly PAGINAS_VISIBLES = 3; // Número de páginas a mostrar alrededor de la actual

  ngOnInit(): void {
    this.initPaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paginador'] && !changes['paginador'].firstChange) {
      this.initPaginator();
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina !== this.paginador.page.number + 1 && pagina > 0 && pagina <= this.paginador.page.totalPages) {
      this.paginaSeleccionada.emit(pagina - 1);
    }
  }

  private initPaginator(): void {          
    if (!this.paginador) return;
    const totalPages = this.paginador.page.totalPages;    
    const currentPage = this.paginador.page.number + 1; // Convertir a 1-based index    
    let startPage = Math.max(1, currentPage - Math.floor(this.PAGINAS_VISIBLES / 2));
    let endPage = startPage + this.PAGINAS_VISIBLES - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - this.PAGINAS_VISIBLES + 1);
    }
    this.paginas = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

}
