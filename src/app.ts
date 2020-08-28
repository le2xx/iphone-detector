import './main.scss';
import './index.html';

const enum ETest {
  'test',
  'test2'
}

const message: string = 'App is started!';
console.log(message, ETest.test);