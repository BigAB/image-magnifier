import QUnit from 'steal-qunit';
import { ViewModel } from './image-magnifier';
import Map from 'can/map/';

// ViewModel unit tests
QUnit.module('image-magnifier', function() {

  QUnit.test('Has message', function(assert){
    var vm = new ViewModel();
    assert.ok(vm instanceof Map, 'View Model is an instance of can.Map');
  });

});
