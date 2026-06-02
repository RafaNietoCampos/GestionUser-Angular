import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ImagesService {

  private http = inject(HttpClient)

  createImage (form: FormData): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${environment.apiUrl}/api/image`, form)
  }

}
