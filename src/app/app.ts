import { Component } from '@angular/core';
import { UsersTable } from './components/users-table/users-table';

@Component({
  selector: 'app-root',
  imports: [UsersTable],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
