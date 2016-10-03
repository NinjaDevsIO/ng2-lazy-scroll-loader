import {
  Type,
  NgModule,
  ModuleWithProviders,
  SystemJsNgModuleLoader
} from  '@angular/core';

import {ComponentToken} from './component-token';
import {LoadModuleDirective} from './load-module.directive';
import {LazyScrollLoaderService} from './lazy-scroll-loader.service';
import {LazyScrollLoaderOptions} from './lazy-scroll-loader-options';

@NgModule({
  declarations: [LoadModuleDirective],
  exports: [LoadModuleDirective]
})
export class LazyScrollLoaderModule {
  public static forRoot(config?: LazyScrollLoaderOptions): ModuleWithProviders {
    return {
      ngModule: LazyScrollLoaderModule,
      providers: [
        LazyScrollLoaderService,
        SystemJsNgModuleLoader,
        {
          provide: LazyScrollLoaderOptions,
          useValue: config
        }
      ]
    };
  }

  public static forChild(component: Type<any>): ModuleWithProviders {
    return {
      ngModule: LazyScrollLoaderModule,
      providers: [{
        provide: ComponentToken,
        useValue: component
      }]
    };
  }
}
