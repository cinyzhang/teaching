import { Injectable } from '@angular/core';
import {Hero} from './hero';
import {Observable, of} from 'rxjs';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {


  constructor(private messageService:MessageService,private http:HttpClient) { }
  private heroesUrl = 'api/heroes';


  private log(message:string){
    this.messageService.add(`HeroService: ${message}`);
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes',[]))
      );
  }


  getHero(id: number): Observable<Hero> {
    // TODO: send the message _after_ fetching the hero
    const url=`${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_=>this.log(`fetch hero id=${id}`)),
      catchError(this.handleError<Hero>(`fetch hero id=${id}`))
    );

  }

  updateHero(hero:Hero):Observable<any>{
    const  httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.put(this.heroesUrl,hero,httpOptions)
      .pipe(
        tap(_=>this.log(`update hero id =${hero.id}`)),
        catchError( this.handleError<any>('updateHero'))
      );
  }
  addHero(hero:Hero):Observable<Hero>{
    const  httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(this.heroesUrl,hero,httpOptions).pipe(
      tap((hero1:Hero)=>{
        this.log(`add Hero id=${hero1.id}`);
      })
    );
  }
  /** DELETE: delete the hero from the server */
  deleteHero (hero: Hero | number): Observable<Hero> {
    const  httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
