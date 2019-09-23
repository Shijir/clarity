/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { ClrDatagridStringFilterInterface } from 'src/clr-angular/data/datagrid/interfaces/string-filter.interface';
import { USERS } from '../../i18n-a11y/users';

class MyIdFilter implements ClrDatagridStringFilterInterface<User> {
  accepts(user: User, search: string): boolean {
    return user.id.toString() === search;
  }
}
class MyNameFilter implements ClrDatagridStringFilterInterface<User> {
  accepts(user: User, search: string): boolean {
    return '' + user.name === search || user.name.toLowerCase().indexOf(search) >= 0;
  }
}

class MyPokemonFilter implements ClrDatagridStringFilterInterface<User> {
  accepts(user: User, search: string): boolean {
    return user.pokemon.name.endsWith(search);
  }
}

@Component({
  selector: 'clr-datagrid-filtering-demo',
  providers: [Inventory],
  templateUrl: './filtering.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridFilteringDemo {
  users: User[];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  nameStringFilter = new MyNameFilter();
  pokemonStringFilter = new MyPokemonFilter();
  idStringFilter = new MyIdFilter();
}
