import { NgModule } from '@angular/core';
import { BlockCopyPasteDirective } from './block-copy-paste.directive';
import { HideFabDirective } from './hide-fab.directive';
import { HideOnScrollDirective } from './hide-on-scroll.directive';

@NgModule({
  imports: [],
  declarations: [BlockCopyPasteDirective, HideFabDirective, HideOnScrollDirective],
  exports: [BlockCopyPasteDirective, HideFabDirective, HideOnScrollDirective]
})
export class DirectivesModule { }
