import {NgModule, Component} from '@angular/core';

import {ComponentToken} from '../src/component-token';

@Component({template: '<p>Test</p>'})
class TestComponent {}

@NgModule({
  providers: [{provide: ComponentToken, useValue: TestComponent}],
  declarations: [TestComponent],
  entryComponents: [TestComponent]
})
export class TestModule {}
