import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHulyEmbed } from '@huly-embed/angular';
import { AppComponent } from './app/app.component';
import { hulyConfig } from './app/config';

bootstrapApplication(AppComponent, {
  providers: [provideHulyEmbed(hulyConfig)],
}).catch((err) => console.error(err));
