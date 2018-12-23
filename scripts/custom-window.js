import {viewIn, viewOut, shouldHandle} from 'https://unpkg.com/@ramlmn/view@1.0.0/esm/index.js';

function isChildNode(parent, child) {
  return parent.querySelector(child);
}

class CustomWindow extends HTMLElement {
  constructor() {
    super();

    const template = document.querySelector('#tmpl-custom-window');
    this.root = this.attachShadow({mode: 'closed'});
    this.root.appendChild(template.content.cloneNode(true));

    this.setAttribute('tabindex', 0);

    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);

    this._onMinimize = this._onMinimize.bind(this);
    this._onMaximize = this._onMaximize.bind(this);
    this._onClose = this._onClose.bind(this);

    this._mouseDragStart = this._mouseDragStart.bind(this);
    this._mouseDragging = this._mouseDragging.bind(this);
    this._mouseDragEnd = this._mouseDragEnd.bind(this);

    this.addEventListener('mousedown', this._onFocus);
    this.addEventListener('blur', this._onBlur);

    this.titleElement = this.root.querySelector('.header .title');
    this.titleElement.addEventListener('mousedown', this._mouseDragStart);
    this.titleElement.addEventListener('dblclick', this._onMaximize);

    this.minimizeButton = this.root.querySelector('.header .actions .action--minimize');
    this.maximizeButton = this.root.querySelector('.header .actions .action--maximize');
    this.closeButton = this.root.querySelector('.header .actions .action--close');

    this.minimizeButton.addEventListener('click', this._onMinimize);
    this.maximizeButton.addEventListener('click', this._onMaximize);
    this.closeButton.addEventListener('click', this._onClose);

    this._onFocus();
  }

  _onFocus() {
    this.setAttribute('active', true);

    if (this._viewId) {
      return;
    }

    this._viewId = viewIn();
  }

  _onBlur() {
    if (!this._viewId) {
      return;
    }

    viewOut(this._viewId);
    this._viewId = null;

    this.removeAttribute('active');
  }

  _onMinimize() {
    this.toggleAttribute('minimized');
  }

  _onMaximize() {
    this.toggleAttribute('maximized');
  }

  _onClose() {
    this.parentElement.removeChild(this);
  }

  _mouseDragStart(event) {
    // focus so that you immediately start dragging unfocused window
    this._onFocus();

    if (!shouldHandle(this._viewId)) {
      return;
    }

    window.addEventListener('mousemove', this._mouseDragging);
    window.addEventListener('mouseup', this._mouseDragEnd);

    const bcr = this.getBoundingClientRect();
    this._offsetLeft = event.pageX - bcr.left;
    this._offsetTop = event.pageY - bcr.top;
  }

  _mouseDragging(event) {
    if (this.hasAttribute('maximized')) {
      this._onMaximize();
    }

    const left = event.pageX - this._offsetLeft;
    const top = event.pageY - this._offsetTop;
    this.style.transform = `translateX(${left}px) translateY(${top}px)`;
  }

  _mouseDragEnd(event) {
    window.removeEventListener('mousemove', this._mouseDragging);
    window.removeEventListener('mouseup', this._mouseDragEnd);
  }

  minimize() {
    this._onMinimize();
  }

  maximize() {
    this._onMaximize();
  }

  close() {
    this._onClose();
  }
}

export default CustomWindow;
