import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { AdminLeftNav } from '../admin-left-nav/admin-left-nav';
import { GeneralFooter } from '../../../SharedPages/general-footer/general-footer';

interface StatCard {
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface VisitPoint {
  label: string;
  visits: number;
}

@Component({
  selector: 'app-admin-landing-page',
  imports: [AdminLeftNav, GeneralFooter, MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './admin-landing-page.html',
  styleUrl: './admin-landing-page.scss',
})
export class AdminLandingPage implements AfterViewInit, OnDestroy {
  @ViewChild('visitsChart')
  private visitsChartRef?: ElementRef<HTMLCanvasElement>;

  private visitsChart?: Chart;

  readonly stats: StatCard[] = [
    { label: 'Total Songs', value: '3', icon: 'library_music', color: '#7c4dff' },
    { label: 'Total Visits', value: '12,480', icon: 'visibility', color: '#00bcd4' },
    { label: 'Average Visit', value: '4m 12s', icon: 'timer', color: '#ff9800' },
  ];

  readonly visitsByDay: VisitPoint[] = [
    { label: 'Mon', visits: 980 },
    { label: 'Tue', visits: 1240 },
    { label: 'Wed', visits: 1110 },
    { label: 'Thu', visits: 1520 },
    { label: 'Fri', visits: 1680 },
    { label: 'Sat', visits: 1360 },
    { label: 'Sun', visits: 1210 },
  ];

  ngAfterViewInit(): void {
    const chartCanvas = this.visitsChartRef?.nativeElement;
    if (!chartCanvas) {
      return;
    }

    this.visitsChart = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: this.visitsByDay.map((point) => point.label),
        datasets: [
          {
            label: 'Visits',
            data: this.visitsByDay.map((point) => point.visits),
            borderRadius: 8,
            backgroundColor: '#7c9dff',
            hoverBackgroundColor: '#9bb4ff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 650,
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#9aa4b2',
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(124, 157, 255, 0.12)',
            },
            ticks: {
              color: '#9aa4b2',
            },
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.visitsChart?.destroy();
  }
}
