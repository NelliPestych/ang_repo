import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalyticsPage } from '../shared/interfaces';
import { AnalyticsService } from '../shared/services/analytics.service';
import { Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js' 

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef!: ElementRef
  @ViewChild('order') orderRef!: ElementRef

  aSub!: Subscription
  average!: number
  pending = true

  constructor(private service: AnalyticsService) { }

  ngAfterViewInit(): void {
    const gainConfig: any = {
label: 'Выручка',
color: 'rgb(255, 99, 132)'
    }
    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
          }
   this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
this.average = data.average
gainConfig.labels = data.chart.map(item => item.label)
gainConfig.data = data.chart.map(item => item.gain)

orderConfig.labels = data.chart.map(i => i.label)
orderConfig.data = data.chart.map(i => i.order)

const gainCtx = this.gainRef.nativeElement.getContext('2d')
const orderCtx = this.orderRef.nativeElement.getContext('2d')
gainCtx.canvas.height = '300px';
orderCtx.canvas.height = '300px';
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
new Chart(gainCtx, createChartConfig(gainConfig));
new Chart(orderCtx, createChartConfig(orderConfig))
 
this.pending = false
    })
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}

function createChartConfig(gainConfig: any): any {
  const {labels, data, label, color} = gainConfig
  return {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          steppedLine: false,
          data: data,
          borderColor: color,
          fill: false
        }
      ]
    },
    options: {
      responsive: true
    }
  }
}
