import {
  Type,
  NgModule,
  ModuleWithProviders,
  SystemJsNgModuleLoader
} from  '@angular/core';

import {ComponentToken} from './src/component-token';
import {LoadModuleDirective} from './src/load-module.directive';
import {LazyScrollLoaderService} from './src/lazy-scroll-loader.service';
import {LazyScrollLoaderOptions} from './src/lazy-scroll-loader-options';

export {LazyScrollLoaderOptions};

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
