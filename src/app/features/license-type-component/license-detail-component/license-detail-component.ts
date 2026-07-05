import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../core/services/modal-service';
import { LicenseType } from '../license-type';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { StatusTranslatePipe } from '../../../shared/pipes/status-translate-pipe';

@Component({
  selector: 'app-license-detail-component',
  standalone: true,
  imports: [CommonModule, StatusTranslatePipe],
  templateUrl: './license-detail-component.html',
  styleUrl: './license-detail-component.css'
})
export class LicenseDetailComponent implements OnInit {
  @Input() licenseType!: LicenseType;

  constructor(
    public modalService: ModalService
  ) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.modalService.cerrarModal();
  }


}
