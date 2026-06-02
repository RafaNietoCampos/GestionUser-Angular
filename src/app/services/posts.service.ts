import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Post, type CreatePost } from '@app/types/post'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class PostsService {

  private http = inject(HttpClient)

  getAll (): Observable<Array<Post>> {
    return this.http.get<Array<Post>>(`${environment.apiUrl}/api/news/all`)
  }

  getById (id: number): Observable<Post> {
    return this.http.get<Post>(`${environment.apiUrl}/api/news/${id}`)
  }

  update (post: CreatePost): Observable<Post> {
    return this.http.put<Post>(`${environment.apiUrl}/api/news/${post.id}`, post)
  }

  create (newPost: CreatePost): Observable<Post> {
    return this.http.post<Post>(`${environment.apiUrl}/api/news`, newPost)
  }

  deletePost (id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/news/${id}`)
  }

}
