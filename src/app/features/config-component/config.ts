import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-config-component',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './config.html',
  styleUrl: './config.css'
})
export class ConfigComponent {

}
