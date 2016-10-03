import {Directive, Input, OnInit, OnDestroy, ElementRef} from '@angular/core';

import {LazyScrollLoaderService} from './lazy-scroll-loader.service';

@Directive({selector: '[loadModule]'})
export class LoadModuleDirective implements OnInit, OnDestroy {
  @Input()
  public loadModule: string;

  constructor(private ref: ElementRef, private loader: LazyScrollLoaderService) {}

  public ngOnInit(): void {
    this.loader.registerElement(this.ref, this.loadModule);
  }

  public ngOnDestroy(): void {
    this.loader.deregisterElement(this.ref);
  }
}
