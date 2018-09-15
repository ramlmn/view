# View
> Handle global events in views with ease

If there are multiple views in your applicaiton handling global events then triggering these events only for the active views is hard, or it _is_ as simple as this library.

## Insallation
``` sh
npm i --save @ramlmn/view
```

## Usage
In your `component.js` file

``` js
// CJS style
const {viewIn, viewOut, shouldHandle} = require('@ramlmn/view');

// ESM style
import {viewIn, viewOut, shouldHandle} from '@ramlmn/view';

// actual component code
class Modal extends HTMLElement {
   connectedCallback() {
     // a global event listener
     document.addEventListner('keydown', event => {
       if (shouldHandle(this.viewId)) {
         // do something
       }
     });
   }

   show() {
     // guard for repeated `viewIn()` calls
     this.viewId = viewIn();
   }

   hide() {
     viewOut(this.viewId);
   }
 }
```

## License
[MIT](license)
