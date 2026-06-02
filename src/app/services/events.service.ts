import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import type { CreateEvent, Event } from '@app/types/event'
import { map, Observable } from 'rxjs'
import { environment } from '../../environments/environment'


@Injectable({
  providedIn: 'root',
})
export class EventsService {

  private http = inject(HttpClient)



  getEventsByDate(year: number, month: number): Observable<Array<Event>> {
    return this.http.get<Array<Event>>(`${environment.apiUrl}/api/events/month`, {
      params: {
        year,
        month
      }
    })
      .pipe(
        map(valueList => {
          return valueList.map(mapToEvent).filter(value => value !== null)
        })
      )
  }

  getAllEvents(): Observable<Array<Event>> {
    return this.http.get<Array<Event>>(`${environment.apiUrl}/api/events/all`)
      .pipe(
        map(valueList => {
          return valueList.map(mapToEvent).filter(value => value !== null)
        })
      )
  }

  postEvent(newEvent: CreateEvent): Observable<Event> {
    const payload: any = {
      title: newEvent.title,
      description: newEvent.description,
      fecha: newEvent.date instanceof Date
        ? newEvent.date.toISOString().slice(0, 10)
        : newEvent.date, // ya viene en formato yyyy-MM-dd
    }

    if (newEvent.groupId !== undefined && newEvent.groupId !== null) {
      payload.grupoId = newEvent.groupId
    }

    return this.http.post<Event>(`${environment.apiUrl}/api/events`, payload)
  }

  putEvent(event: Event): Observable<Event> {
    const payload: any = {
      title: event.title,
      description: event.description,
      fecha: event.date instanceof Date
        ? event.date.toISOString().slice(0, 10)
        : event.date, // ya viene en formato yyyy-MM-dd
    }

    if (event.group?.id !== undefined && event.group?.id !== null) {
      payload.grupoId = event.group.id
    }

    return this.http.put<Event>(`${environment.apiUrl}/api/events/${event.id}`, payload)
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/events/${id}`)
  }


}


function mapToEvent(data: any): Event | null {
  if (!data?.title) return null

  return {
    ...data,
    date: new Date(data.fecha),
    group: {
      id: data.grupoId || data.groupId,
      name: data.grupoNombre || data.groupName
    }
  }
}
