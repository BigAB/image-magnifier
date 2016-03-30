/*jshint unused:false */
import can from 'can';
import Component from 'can/component/';
import Map from 'can/map/';
import List from 'can/list/';
import 'can/map/define/';
import './image-magnifier-view.less!';
import template from './image-magnifier-view.stache!';

export const ViewModel = Map.extend({
  define: {
    for: {
      type: 'string'
    },
    magnifierViewModels: {
      value: [],
      set(newVal) {
        let oldMaps = this.attr('magnifierViewModels');
        if (oldMaps instanceof List) {
          oldMaps.forEach( (m) => {
            m.removeAttr('viewerSize');
          });
        }
        if (newVal instanceof List) {
          newVal.forEach( (m) => {
            m.attr('viewerSize', this.attr('viewerSize'));
          });
        }
        return newVal;
      }
    },
    viewerSize: {
      set(newVal) {
        if (newVal) {
          this.attr('magnifierViewModels').forEach( (m) => {
            m.attr('viewerSize', newVal);
          });
        } else {
          this.attr('magnifierViewModels').forEach( (m) => {
            m.removeAttr('viewerSize');
          });
        }
        return newVal;
      }
    },
    activeSource: {
      get() {
        return this.attr('magnifierViewModels')
          .filter(m => m.attr('active'))
          .attr('0');
      }
    },
    imageRect: {
      get() {
        const rectZero = { origin: { x: 0, y: 0 }, size: { height: 0, width: 0 } };
        let viewerSize = this.attr('viewerSize');
        if (!viewerSize) {
          return rectZero;
        }
        let activeSource = this.attr('activeSource');
        if (!activeSource) {
          return rectZero;
        }
        let rawImageSize = this.attr('rawImageSize');
        if (!rawImageSize) {
          return rectZero;
        }

        let aspectRatio = rawImageSize.width ? rawImageSize.height / rawImageSize.width : 0;
        let lensScale = activeSource.attr('lensScale');
        let lensRect = activeSource.attr('lensRect');
        let thumbSize = activeSource.attr('thumbSize');

        let height, width;

        if (aspectRatio > 1) {
          height = 1 / lensScale * viewerSize.height;
          width = height / aspectRatio;
        } else {
          width = 1 / lensScale * viewerSize.width;
          height = aspectRatio ? width * aspectRatio : 0;
        }

        let x = thumbSize.width ? lensRect.origin.x / thumbSize.width * width * -1 : 0;
        let y = thumbSize.height ? lensRect.origin.y / thumbSize.height * height * -1 : 0;

        let imageRect = {
          origin: { x, y },
          size: { height, width }
        };

        return imageRect;
      }
    },
    rawImageSize: {

    }
  },
  updateRawImageSize(height, width) {
    this.attr('rawImageSize', {
      height,
      width
    });
  }
});

function getViewModelsFrom( selector ) {
  let elements = can.$( selector );
  // create an array of all the matching "for" elements' viewModels
  return can.map( elements, (m) => can.viewModel(m) );
}

export default Component.extend({
  tag: 'image-magnifier-view',
  viewModel: ViewModel,
  template,
  events: {
    inserted(el, evt) {
      let viewModels = getViewModelsFrom( this.viewModel.attr('for') );
      this.viewModel.attr( 'magnifierViewModels', viewModels);
      this.element.trigger('update-viewer-size');
    },
    "{viewModel} for": function(vm, evt) {
      let viewModels = getViewModelsFrom( this.viewModel.attr('for') );
      this.viewModel.attr( 'magnifierViewModels', viewModels);
    },
    "{viewModel} imageRect": function(vm, evt) {
      var rect = vm.attr('imageRect');
			let { origin: { x:left, y:top }, size: { height, width } } = rect;
			this.element.find('.image-magnifier-view-image').css({
				left,
				top,
				height,
				width
			});
    },
    // there has to be  better way - BigAB
    "{window} resize": function(window, event) {
      this.element.trigger('update-viewer-size');
    },
    "update-viewer-size": function(el, evt) {
      let size = {
        height: this.element.height(),
        width: this.element.width()
      };
      this.viewModel.attr('viewerSize', size);
    }
  }
});
