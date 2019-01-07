import { KrameriusApiService } from './kramerius-api.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../model/user.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/do';
import { HttpRequestCache } from './http-request-cache.service';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class AuthService {

    // private subject = new BehaviorSubject<User>(User.DUMMY_USER);

    // user$: Observable<User> = this.subject.asObservable();

    user: User = null;

    // isLoggedIn$: Observable<boolean> = this.user$.map(user => user.isLoggedIn());
    // isLoggedOut$: Observable<boolean> = this.user$.map(user => !user.isLoggedIn());

    constructor(private krameriusApi: KrameriusApiService, private cookieService: CookieService, private cache: HttpRequestCache) {
    }

    login(username: string, password: string) {
        return this.krameriusApi.getUserInfo(username, password)
                                .do(user => {
                                    this.user = user;
                                    this.cache.clear();
                                });
    }

    logout() {
        if (!this.isLoggedIn()) {
            return;
        }
        return this.krameriusApi.logout()
                                .do(user => {
                                    this.cache.clear();
                                    this.user = null;
                                });
    }


    isLoggedIn(): boolean {
        return this.user && this.user.isLoggedIn();
    }

}