import {fromEvent, ReplaySubject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

export interface IScreen {
  availWidth: number;
  availHeight: number;
  width: number;
  height: number;
  isPortrait: boolean;
  isLandscape: boolean;
}

export enum EIPhones {
  XII = 'XII',
  XI_Pro_Max_14 = 'XI_Pro_Max_14',
  XI_Pro_Max = 'XI_Pro_Max',
  XI_Pro = 'XI_Pro',
  XI = 'XI',
  XI_14 = 'XI_14',
  XR = 'XR',
  XS_Max = 'XS_Max',
  XS = 'XS',
  XS_13 = 'XS_13',
  X = 'X'
}

export interface IIPhonesProperties {
  logicalWidth: number;
  logicalHeight: number;
  innerHeightP?: number;
  innerHeightL?: number;
  innerHeightPExpand?: number;
  innerHeightLExpand?: number;
  devicePixelRatio?: number;
  osVersion?: number;
}

const devices: { [key: string]: IIPhonesProperties } = {
  [EIPhones.XII]: {
    logicalWidth: 390,
    logicalHeight: 844,
    innerHeightP: 778,
    innerHeightL: 390,
    innerHeightPExpand: 664,
    innerHeightLExpand: 340,
    devicePixelRatio: 3,
    osVersion: 14
  },
  [EIPhones.XI_Pro_Max_14]: {
    logicalWidth: 414,
    logicalHeight: 896,
    innerHeightP: 833,
    innerHeightL: 414,
    innerHeightPExpand: 719,
    innerHeightLExpand: 364,
    devicePixelRatio: 3,
    osVersion: 14
  },
  [EIPhones.XI_Pro_Max]: {
    logicalWidth: 414,
    logicalHeight: 896,
    innerHeightP: 832,
    innerHeightL: 414,
    innerHeightPExpand: 719,
    innerHeightLExpand: 364,
    devicePixelRatio: 3,
    osVersion: 13
  },
  [EIPhones.XI_Pro]: {
    logicalWidth: 375,
    logicalHeight: 812,
    innerHeightP: 749,
    innerHeightL: 375,
    innerHeightPExpand: 635,
    innerHeightLExpand: 325,
    devicePixelRatio: 3,
    osVersion: 13
  },
  [EIPhones.XI]: {
    logicalWidth: 414,
    logicalHeight: 896,
    innerHeightP: 833,
    innerHeightL: 414,
    innerHeightPExpand: 719,
    innerHeightLExpand: 364,
    devicePixelRatio: 2,
    osVersion: 13
  },
  [EIPhones.XI_14]: {
    logicalWidth: 414,
    logicalHeight: 896,
    innerHeightP: 829,
    innerHeightL: 414,
    innerHeightPExpand: 715,
    innerHeightLExpand: 364,
    devicePixelRatio: 2,
    osVersion: 14
  },
  [EIPhones.XR]: {
    logicalWidth: 414,
    logicalHeight: 896,
    innerHeightP: 833,
    innerHeightL: 414,
    innerHeightPExpand: 719,
    innerHeightLExpand: 364,
    devicePixelRatio: 2,
    osVersion: 12
  },
  [EIPhones.XS_Max]: {
    logicalWidth: 414,
    logicalHeight: 896,
    innerHeightP: 832,
    innerHeightL: 414,
    innerHeightPExpand: 719,
    innerHeightLExpand: 364,
    devicePixelRatio: 3,
    osVersion: 12
  },
  [EIPhones.XS]: {
    logicalWidth: 375,
    logicalHeight: 812,
    innerHeightP: 748,
    innerHeightL: 375,
    innerHeightPExpand: 635,
    innerHeightLExpand: 325,
    devicePixelRatio: 3,
    osVersion: 12
  },
  [EIPhones.XS_13]: {
    logicalWidth: 375,
    logicalHeight: 812,
    innerHeightP: 749,
    innerHeightL: 375,
    innerHeightPExpand: 635,
    innerHeightLExpand: 325,
    devicePixelRatio: 3,
    osVersion: 13
  },
  [EIPhones.X]: {
    logicalWidth: 375,
    logicalHeight: 812,
    innerHeightP: 748,
    innerHeightL: 375,
    innerHeightPExpand: 635,
    innerHeightLExpand: 325,
    devicePixelRatio: 3,
    osVersion: 11
  }
};

export class IPhoneDetector {
  private subscription = new Subscription();

  private _screenOptions = new ReplaySubject<IScreen>(1);
  public screenOptions$ = this._screenOptions.asObservable();

  constructor() {
    this.subscription.add(fromEvent(window, 'resize')
        .pipe(
            debounceTime(200),
            distinctUntilChanged()
        )
        .subscribe(event => {
          this._screenOptions.next(IPhoneDetector.screenOptions());
        }));
  }

  private static screenOptions(): IScreen {
    return {
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      width: window.screen.width,
      height: window.screen.height,
      isPortrait: window.orientation ? window.orientation === 0 : true,
      isLandscape: window.orientation ? window.orientation === 90 : false
    };
  }

  public iPhoneModels() {
    if (this.isMobile && this.isIPhone) {
      const keys = Object.keys(devices);
      return keys.filter(key =>
          (devices[key].logicalWidth === window.screen.width &&
              devices[key].logicalHeight === window.screen.height) ||
          (devices[key].logicalWidth === window.screen.height &&
              devices[key].logicalHeight === window.screen.width))
          .filter(key => devices[key].osVersion === this.osVersion)
          .filter(key => devices[key].devicePixelRatio === this.devicePixelRatio);
    }
    return [];
  }

  public get isIPhone(): boolean {
    return !!navigator.userAgent.match(/iPhone/i);
  }

  public get isMobile(): boolean {
    return !!navigator.userAgent.match(/Mobile/i);
  }

  public get osVersion(): number {
    if (!this.isIPhone) {
      return null;
    }
    const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    return parseInt(v[1], 10);
  }

  public get devicePixelRatio(): number {
    return window.devicePixelRatio;
  }

  public get toolsExpanded(): boolean {
    const devicesList = this.iPhoneModels()
        .map(key => IPhoneDetector.screenOptions().isPortrait ?
            devices[key].innerHeightPExpand === window.innerHeight :
            devices[key].innerHeightLExpand === window.innerHeight
        );
    return devicesList.includes(true);
  }
}
