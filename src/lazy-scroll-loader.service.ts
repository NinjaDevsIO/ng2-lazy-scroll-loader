import {
  NgZone,
  Injector,
  Injectable,
  ElementRef,
  ApplicationRef,
  NgModuleFactory,
  ReflectiveInjector,
  ApplicationInitStatus,
  SystemJsNgModuleLoader
} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';

import {ComponentToken} from './component-token';
import {LazyScrollLoaderOptions} from './lazy-scroll-loader-options';

@Injectable()
export class LazyScrollLoaderService {
  private pool = new Map<ElementRef, string>();
  private options: LazyScrollLoaderOptions = {
    debounceTime: 200,
    padding: 0
  };

  constructor(config: LazyScrollLoaderOptions,
    private loader: SystemJsNgModuleLoader,
    private zone: NgZone,
    private injector: Injector,
    private appRef: ApplicationRef,
    initStatus: ApplicationInitStatus
  ) {
    this.options = Object.assign(this.options, config);

    this.subscribe();

    initStatus.donePromise.then(() => this.checkElements());
  }

  public registerElement(el: ElementRef, modulePath: string): void {
    this.pool.set(el, modulePath);
  }

  public deregisterElement(el: ElementRef): void {
    this.pool.delete(el);
  }

  private subscribe(): void {
    const scroll$ = Observable.fromEvent<any>(window, 'scroll');
    const resize$ = Observable.fromEvent<any>(window, 'resize');
    const orientation$ = Observable.fromEvent<any>(window, 'orientationchange');

    let combined$ = Observable.merge(scroll$, resize$);

    if (this.options.debounceTime) {
      combined$ = combined$.debounceTime(this.options.debounceTime);
    }

    combined$ = Observable.merge(combined$, orientation$);

    combined$.subscribe(() => this.checkElements());
  }

  private checkElements(): void {
    this.pool.forEach((path, el) => {
      if (!el.nativeElement || !this.isElementInViewport(el.nativeElement)) {
        return;
      }

      this.bootstrapComponent(el, path);
    });
  }

  public bootstrapComponent(el: ElementRef, path: string): void {
    this.loader.load(path)
    .then(moduleFactory => {
      this.bootstrapWithCustomSelector(el, moduleFactory);
    })
    .then(() => {
      this.deregisterElement(el);
    });
  }

  public bootstrapWithCustomSelector(el: ElementRef,
    moduleFactory: NgModuleFactory<any>
  ): void {
    this.zone.run(() => {
      // Get the parent injector and create the module
      const parentInjector = ReflectiveInjector
        .resolveAndCreate([], this.injector);
      const ngModule = moduleFactory.create(parentInjector);

      // Some dependencies from this module
      const initStatus = ngModule.injector.get(ApplicationInitStatus);
      const component = ngModule.injector.get(ComponentToken);

      if (!component) {
        // TODO throw
      }

      initStatus.donePromise.then(() => {
        const elementId = this.generateRandomId();
        (el.nativeElement as HTMLElement).setAttribute('id', elementId);

        const compFactory = ngModule.componentFactoryResolver
          .resolveComponentFactory(component);

        compFactory.selector = `#${elementId}`;

        this.appRef.bootstrap(compFactory);
      });
    });
  }

  private isElementInViewport(el: HTMLElement): boolean {
    const bottomLimit = 0 - this.options.padding;
    const rightLimit = 0 - this.options.padding;
    const leftLimit = (window.innerWidth || document.documentElement.clientWidth) +
      this.options.padding;
    const topLimit = (window.innerHeight || document.documentElement.clientHeight) +
      this.options.padding;

    let rect: ClientRect;

    if (this.supportsBoundingClientRect()) {
      rect = el.getBoundingClientRect();
    } else {
      rect = this.getBoundingClientRect(el);
    }

    return !(
      rect.bottom < bottomLimit ||
      rect.right < rightLimit ||
      rect.left > leftLimit ||
      rect.top > topLimit
    );
  }

  private getBoundingClientRect(el: HTMLElement): ClientRect {
    const top = el.offsetTop - window.scrollY;
    const bottom = top + el.clientHeight;
    const left = el.offsetLeft - window.scrollX;
    const right = left + el.clientWidth;

    return {
      top, bottom, right, left, height: el.clientHeight, width: el.clientWidth
    };
  }

  private supportsBoundingClientRect(): boolean {
    return !/android.*chrome\/[.0-9]+/i.test(window.navigator.userAgent);
  }

  private generateRandomId(): string {
    return 'scroll-loader-' +
      Math.round(10000000 + Math.random() * new Date().getTime()).toString();
  }
}
