import './main.scss';
import './index.html';
import { IPhoneDetector, IScreen } from "./classes/IPhoneDetector";

const iPhoneDetector: IPhoneDetector = new IPhoneDetector();
let screenOptions: IScreen;

const name = document.querySelector('.name');
const orientation = document.querySelector('.orientation');
const size = document.querySelector('.size');
const os = document.querySelector('.os');
const footer = document.querySelector('.footer');

window.onload = () => {
  setTimeout(() => {
    setName();
    setOrientation();
    setSize();
    setOs();
    expandTools();
  }, 1000);
};

iPhoneDetector.screenOptions$.subscribe(options => {
  screenOptions = options;

  // console.log(options);
  // console.log(iPhoneDetector.iPhoneModels());
  // console.log(window.navigator.userAgent);
  // console.log(window.innerHeight);
  // console.log(window.screen);
  // console.log('-------mobile ', iPhoneDetector.isMobile);
  // console.log('-------iphone ', iPhoneDetector.isIPhone);
  // console.log('-------os ', iPhoneDetector.osVersion);
  // console.log('------pixelRatio', iPhoneDetector.devicePixelRatio);
  // console.log('------tools expanded', iPhoneDetector.toolsExpanded);

  setName();
  setOrientation();
  setSize();
  setOs();
  expandTools();
});

const setName = () => {
  const devices = iPhoneDetector.iPhoneModels().map(device => device.split('_').join(' '));
  iPhoneDetector.isIPhone ?
      name.innerHTML = `This iPhone ${devices.join(' or ')}` : name.innerHTML = `This not iPhone`;
}

const setOrientation = () => {
  if (screenOptions) {
    orientation.innerHTML = `Orientation: ${screenOptions.isPortrait ? 'portrait' : 'landscape'}`;
  }
}

const setSize = () => {
  size.innerHTML = `${window.innerWidth}x ${window.innerHeight}`;
}

const setOs = () => {
  os.innerHTML = iPhoneDetector.isIPhone ? `Os ver: ${iPhoneDetector.osVersion}` : 'no Iphone';
}

const expandTools = () => {
  iPhoneDetector.toolsExpanded ? footer.classList.add('expanded') : footer.classList.remove('expanded');
}
