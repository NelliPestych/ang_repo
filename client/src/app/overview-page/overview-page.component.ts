import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MaterialService,
  MaterialInstance,
} from '../shared/classes/material.service';
import * as moment from 'moment';
import { AnalyticsService } from '../shared/services/analytics.service';
import { Observable } from 'rxjs';
import { OverviewPage } from '../shared/interfaces';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css'],
})
export class OverviewPageComponent implements OnInit {
  date!: any;
  tapTarget: any;

  @ViewChild('tapTarget') tapTargetRef: any;

  data$!: Observable<OverviewPage>;

  constructor(public service: AnalyticsService) {}

  ngOnInit() {
    this.date = moment().add(-1, 'd').format('DD.MM.YYYY');
    this.data$ = this.service.getOverview();
  }
}
