import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css'
})
export class Confirmation {
}