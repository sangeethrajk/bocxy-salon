import { NgModule } from '@angular/core';
import { BlockCopyPasteDirective } from './block-copy-paste.directive';
import { ScrollVanishDirective } from './scroll-vanish.directive';

@NgModule({
  imports: [],
  declarations: [BlockCopyPasteDirective, ScrollVanishDirective],
  exports: [BlockCopyPasteDirective, ScrollVanishDirective]
})
export class DirectivesModule { }
