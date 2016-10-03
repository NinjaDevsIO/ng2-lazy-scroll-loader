import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TestBed} from '@angular/core/testing';

import {LoadModuleDirective} from '../src/load-module.directive';
import {LazyScrollLoaderService} from '../src/lazy-scroll-loader.service';

@Component({
  template: `<some-selector loadModule="test/path"></some-selector>`
})
class TestComponent {}

const registerElement = jasmine.createSpy('registerElement');
const deregisterElement = jasmine.createSpy('deregisterElement');

class LazyScrollLoaderServiceMock {
  public registerElement = registerElement;
  public deregisterElement = deregisterElement;
}

describe('LoadModuleDirective', () => {
  beforeEach(() => {
    registerElement.calls.reset();
    deregisterElement.calls.reset();

    TestBed.configureTestingModule({
      declarations: [TestComponent, LoadModuleDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{
        provide: LazyScrollLoaderService,
        useClass: LazyScrollLoaderServiceMock
      }]
    });
  });

  it('should instantiate the component without errors', () => {
    const fixture = TestBed.createComponent(TestComponent);

    expect(fixture.componentInstance instanceof TestComponent)
      .toBe(true, 'should create TestComponent');
  });

  it('should register an element', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(registerElement)
      .toHaveBeenCalledWith(jasmine.any(Object), 'test/path');
  });

  it('should deregister an element on destroy', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    fixture.destroy();

    expect(deregisterElement)
      .toHaveBeenCalledWith(jasmine.any(Object));
  });
});
