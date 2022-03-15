import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { isNull } from '@angular/compiler/src/output/output_ast';
@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  chart_data: any = [];
  options: {};
  legend: any = [];
  card: any = {
    month_income: 0,
    month_profit: 0,
    total_income: 0,
    total_profit: 0
    }
  data_length = 0;

  constructor(private http: HttpClient) { }
  chart_type = 'bar';
  vat_type: string = '';
  start_time: string = '';
  end_time: string = '';
  time_type = '30'
  chart_show = 'sell';
summarys(){
  this.chart_data=[];
  this.legend = [];
  this.get_summary();
}

get_summary(){
  this.summary().subscribe((data: any) => {this.data_length = data.length;})
}

initial_card(){
  this.card_total('monthSell').subscribe((data: any) => {
    this.card.month_income = data.month_income;
    this.card.month_profit = data.month_profit;
  })
  this.card_total('allSell').subscribe((data: any) => {
    // console.log(data);
    this.card.total_income = data.total_income;
    this.card.total_profit = data.total_profit;
  })
}

set_time_type(time){
  this.time_type = time;
  this.summarys();
}

summary(): Observable<any>{
  return this.http.get(environment.API_URL+'dashboard/summary/'+this.chart_show+'/'+this.time_type, environment.httpOptions).pipe(
         map((data: any) => {           
           data.forEach(data => {
            //  console.log(data);
             this.legend.push(data.date);
             this.chart_data.push(data.value);
             this.options = {
              xAxis: {
                type: 'category',
                data: this.legend,
              },
              yAxis: {
                type: 'value',
              },
              tooltip: {
                trigger: 'item',
                // formatter: 'จำนวนเงิน : {c} บาท'
            },
              series: [
                {
                  name: data.name,
                  data: this.chart_data,
                  type: this.chart_type,
                },
              ],
            };
           });
           return data;
         }), catchError( error => {
           return throwError( 'Error' );
         })
      )
  }

  card_total(type): Observable<any>{
    return this.http.get(environment.API_URL+'dashboard/summary/card/'+type, environment.httpOptions).pipe(
           map((data: any) => {
             return data;
           }), catchError( error => {
             return throwError( 'Error' );
           })
        )
    }
}