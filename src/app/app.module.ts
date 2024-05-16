import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { StudyPageComponent } from './components/study-page/study-page.component';
import {SharedModule} from "./shared/shared.module";
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './../assets/', '.json');
}
/**
 * Module component declarations and certain inputs. Will grow larger as new components and pages are created
 */
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudyPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: "en",
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    SharedModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
