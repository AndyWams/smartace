import { Component, OnInit, Renderer2, ViewChildren } from '@angular/core';
import { payscheduleData, scehduleOption } from 'src/assets/raw_data';

@Component({
  selector: 'app-payschedule-setup',
  templateUrl: './payschedule-setup.component.html',
  styleUrls: ['./payschedule-setup.component.scss'],
})
export class PayscheduleSetupComponent implements OnInit {
  @ViewChildren('radioItem') radioItem: any;
  screen: number = 1;
  selectedItem: any;
  constructor(private renderer: Renderer2) {}
  data = payscheduleData;
  _scheduleOption = scehduleOption;
  ngOnInit(): void {}
  gotoView(screenType?: string, screenIndex?: number) {
    if (screenType === 'next') {
      this.screen = this.screen + 1;
    }
    if (screenType === 'prev') {
      this.screen = this.screen - 1;
    }
    if (screenIndex) {
      this.screen = screenIndex;
    }
  }
  handdleScheduleToggle(event: any, i: number) {
    this.radioItem._results.map((x: any, index: number) => {
      if (i === index) {
        this.renderer.addClass(x.nativeElement, 'active');
      } else {
        this.renderer.removeClass(x.nativeElement, 'active');
      }
    });
  }
}
