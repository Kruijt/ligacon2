import { Observable } from 'rxjs';

import { Component } from '@angular/core';
import { Data } from '@angular/router';

import { Select } from '@ngxs/store';

import { RouterNavState } from '../../../store/router-nav/router-nav.state';

@Component({
  selector: 'li-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent {
  @Select(RouterNavState.data)
  readonly routerData$!: Observable<Data>;
}
