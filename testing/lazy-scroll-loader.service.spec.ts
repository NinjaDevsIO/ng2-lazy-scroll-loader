import {TestBed, async} from '@angular/core/testing';
import {SystemJsNgModuleLoader, ApplicationRef} from '@angular/core';

import {LazyScrollLoaderService} from '../src/lazy-scroll-loader.service';
import {LazyScrollLoaderOptions} from '../src/lazy-scroll-loader-options';

const bootstrap = jasmine.createSpy('bootstrap');

describe('LazyScrollLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SystemJsNgModuleLoader,
        LazyScrollLoaderService,
        {provide: LazyScrollLoaderOptions, useValue: {}},
        {provide: ApplicationRef, useValue: {bootstrap}}
      ]
    });
  });

  it('should instantiate the component without errors', () => {
    const service = TestBed.get(LazyScrollLoaderService);

    expect(service instanceof LazyScrollLoaderService)
      .toBe(true, 'should create LazyScrollLoaderService');
  });

  it('should instantiate an element in viewport', async(() => {
    const service = TestBed.get(LazyScrollLoaderService);
    const p = document.createElement('p');
    const rect: ClientRect = {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
      width: 10,
      height: 10
    };

    spyOn(p, 'getBoundingClientRect').and.returnValue(rect);
    service.registerElement({nativeElement: p}, 'testing/test.module#TestModule');

    service.checkElements()
      .then(() => expect(bootstrap).toHaveBeenCalled());
  }));
});
