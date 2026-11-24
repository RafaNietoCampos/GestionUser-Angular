import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateGroup, Group, UpdateGroupPayload } from '@app/types/group';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GrupoService {

  private http = inject(HttpClient)

  getAllGroups(): Observable<Array<Group>> {
    return this.http.get<Array<Group>>(`${environment.apiUrl}/api/grupos`)
  }

  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group>(`${environment.apiUrl}/api/grupos/${id}`)
  }

  postGroup(group: CreateGroup): Observable<Group> {
    return this.http.post<Group>(`${environment.apiUrl}/api/grupos`, group)
  }

  putGroup(id: number, payload: UpdateGroupPayload): Observable<Group> {
    return this.http.put<Group>(
      `${environment.apiUrl}/api/grupos/${id}`,
      payload
    )
  }

  deleteGroup(id: number): Observable<Group> {
    return this.http.delete<Group>(`${environment.apiUrl}/api/grupos/${id}`)
  }

}
