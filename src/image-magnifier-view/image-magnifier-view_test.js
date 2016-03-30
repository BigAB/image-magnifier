import QUnit from 'steal-qunit';
import Map from 'can/map/';
import { ViewModel } from './image-magnifier-view';

// ViewModel unit tests
QUnit.module('image-magnifier/image-magnifier-view');

QUnit.test('View model is an instance of can.Map', function(){
  var vm = new ViewModel();
  QUnit.ok(vm instanceof Map, 'viewModel is an instence of can.Map');
});
