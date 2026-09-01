import { Component } from '@angular/core';

import { UsersTable } from '../../features/users-table/users-table';

@Component({
  selector: 'app-users-page',
  imports: [UsersTable],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
})
export class UsersPage {}
