import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataFinder } from '../../providers/datafinder';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map'
import { Http, Response } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

@Injectable()
export class EventService {
    private dataFinder: DataFinder;
    private url: string =  'assets/eventdata.json';

  constructor(
    private http: HttpClient) { }

    private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }

    public getData(){
        return this.http.get(this.url).map((response:Response) => response.json);
    }

    public getEvents(): Observable<any> {
        //const dateObj = new Date();
        //const yearMonth = dateObj.getUTCFullYear() + (dateObj.getUTCMonth() + 1)
        //getUTCMonth() - January represents 0, etc.
        return this.http.get(this.url)
            .catch(this.handleError);
        /* 
        let data: any = [
        {
            title: 'Long Event',
            start: moment('20180307'),
            end: moment('20180310')
        },
        {
            title: 'Conference',
            start: '20180312T08',
            end: '20180314T13',
        },
        {
            title: 'Meeting',
            start: moment('20180319T1030'),
            end: moment('20180319T1230')
        },
        {
            title: 'Lunch',
            start: moment('20180319T13'),
            end: moment('20180319T14')
        },
        {
            title: 'Meeting',
            start: moment('20180321T1030'),
            end: moment('20180321T1230')
        },
        {
            title: 'ESC Meeting',
            start: moment('20180323T1030'),
            end: moment('20180323T1230')
        },
        {
            title: 'Click for ISTD Website',
            url: 'http://istd.edu.sg',
            start: moment('20180328'),
            end: moment('20180328')
        }];*/


        // /http://momentjs.com/docs/#/parsing/
        //return Observable.of(data);
    }
};
