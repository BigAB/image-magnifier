/*jshint unused:false */
import Component from 'can/component/';
import Map from 'can/map/';
import List from 'can/list/';
import 'can/map/define/';
import './image-magnifier.less!';
import template from './image-magnifier.stache!';

const MIN_LENS_SCALE = 0.10;
const DEFAULT_LENS_SCALE = 0.50;

class Point {
	constructor({ x = 0, y = 0 } = {}) {
		this.x = x;
		this.y = y;
	}
}

class Size {
	constructor({ width = 0, height = 0 } = {}) {
		this.width = width;
		this.height = height;
	}
}

class Rect {
	constructor({ origin = new Point(), size = new Size() }) {
		this.origin = origin;
		this.size = size;
	}

	static create(x, y, width, height) {
		let origin = new Point({ x, y });
		let size = new Size({ width, height });
		return new Rect({ origin, size });
	}
}

export const ViewModel = Map.extend({
	define: {
		src: {
			type: 'string',
			value: ''
		},
		thumbSrc: {
			type: 'string',
			value: '',
			get(lastSetVal) {
				if (!lastSetVal) {
					return this.attr('src');
				}
				return lastSetVal;
			}
		},
		active: {
			type: 'boolean',
			get(val) {
				return val && this.attr('initialized');
			}
		},
		initialized: {
			type: 'boolean'
		},
		viewerSize: {
			value: null
		},
		thumbSize: {
			Type: Size
		},
		lensAspectRatio: {
			get() {
				let viewerSize = this.attr('viewerSize');
				if (viewerSize) {
					return viewerSize.width ? viewerSize.height / viewerSize.width : 0;
				}
				return 1;
			}
		},
		lensScale: {
			type: 'number',
			value: DEFAULT_LENS_SCALE,
			get(lastSetVal) {
				if (lastSetVal > 1) {
					return 1;
				}
				if (lastSetVal < MIN_LENS_SCALE) {
					return MIN_LENS_SCALE;
				}
				return lastSetVal;
			}
		},
		lensSize: {
			Type: Size,
			get() {
				let thumbSize = this.attr('thumbSize');
				if (thumbSize) {
					let scale = this.attr('lensScale');
					let aspectRatio = this.attr('lensAspectRatio');
					let width, height;
					if (aspectRatio > 1) {
						height = thumbSize.height * scale;
						width = height / aspectRatio;
					} else {
						width = thumbSize.width * scale;
						height = aspectRatio? width * aspectRatio : 0;
					}
					return new Size({ height, width });
				}
				return new Size();
			}
		},
		lensPosition: {
			get() {
				let thumbSize = this.attr('thumbSize');
				let pointerPos = this.attr('pointerPosition');
				if (!pointerPos || !thumbSize) {
					return new Point({ x: 0, y: 0 });
				}
				let lensSize = this.attr('lensSize');

				let x = pointerPos.x - Math.floor(lensSize.width / 2);
				x = Math.min(x, thumbSize.width - lensSize.width);
				x = Math.max(x, 0);

				let y = pointerPos.y - Math.floor(lensSize.height / 2);
				y = Math.min(y, thumbSize.height - lensSize.height);
				y = Math.max(y, 0);

				return new Point({
					x,
					y
				});
			}
		},
		lensRect: {
			get() {
				return new Rect({
					origin: this.attr('lensPosition'),
					size: this.attr('lensSize')
				});
			}
		},
		pointerPosition: {
			Type: Point
		}
	},
	setActive(isActive) {
		this.attr('active', isActive);
	},
	updatePointerPosition(pos) {
		this.attr('pointerPosition', pos);
	},
	scaleLens(change) {
		let scale = this.attr('lensScale');
		this.attr('lensScale', (scale*100 + change)/100);
		let newScale = this.attr('lensScale');
		return scale !== newScale;
	}
});

export default Component.extend({
	tag: 'image-magnifier',
	viewModel: ViewModel,
	template,
	events: {
		"inserted": function(el, evt) {
			this.lens = this.element.find('.image-magnifier-lens');
			let thumb = el.find('.image-magnifier-thumb').on('load', (e) => {
				this.viewModel.attr('thumbSize', {
					width: thumb.width(),
					height: thumb.height()
				});
				this.viewModel.attr('initialized', true);
			});
		},
		".image-magnifier-thumb-wrapper mousemove": function(el, evt) {
			let offset = el.offset();
			var x = evt.pageX - offset.left;
			var y = evt.pageY - offset.top;
			this.viewModel.updatePointerPosition({ x, y });
		},
		".image-magnifier-thumb-wrapper wheel": function(el, evt) {
			let e = evt.originalEvent;
			let didScale = this.viewModel.scaleLens(e.deltaY * -1);
			// returning whether the lens was able to scale at all
			// allows wheel scrolling when lens is maxed or min
			return !didScale;
		},
		"{viewModel} lensRect": function(vm, evt) {
			var rect = vm.attr('lensRect');
			let { origin: { x:left, y:top }, size: { height, width } } = rect;
			let backgroundPosition = `${ -left }px ${ -top }px`;

			this.lens.css({
				left,
				top,
				height,
				width,
				backgroundPosition
			});
		}
	}
});
