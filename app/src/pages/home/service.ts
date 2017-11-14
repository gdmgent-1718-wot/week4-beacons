import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Message } from './model';

@Injectable()

export class Service {

    constructor (public http: Http) {}

    getPromo(chl): Observable<Message> {
        let url = `http://localhost:3000/promotions/` + chl;
        let options: RequestOptions = new RequestOptions({ headers: new Headers({})
        });

        return this.http.get(url, options)
            .map((res:Response) => res.json())
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
    }

}
