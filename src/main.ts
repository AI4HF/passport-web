import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
/**
 * Main method which simply calls for the main app with the settings set in index.html
 * index.html also sets up the AI4HF icon in the website.
 */

