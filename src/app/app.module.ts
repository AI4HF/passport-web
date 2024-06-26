import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {environment} from "../environments/environment";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HTTP_INTERCEPTORS, HttpClient} from "@angular/common/http";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthInterceptor} from "./core/guards/auth.interceptor";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/');
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            defaultLanguage: environment.defaultLanguage,
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ToastModule
    ],
    bootstrap: [AppComponent],
    providers: [
        MessageService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class AppModule { }
