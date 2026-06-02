import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router'
import { ArrowIcon } from '@app/components/icons/arrow'
import { Image } from '@app/components/image/image'
import { AuthService } from '@app/services/auth.service'
import { PostsService } from '@app/services/posts.service'
import type { Post } from '@app/types/post'
import { map, switchMap } from 'rxjs'

@Component({
  selector: 'app-post-detail',
  imports: [CommonModule, ArrowIcon, Image],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.css',
})
export class PostDetail {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private postsService = inject(PostsService);
  authService = inject(AuthService)

  post = toSignal<Post | null>(
    this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id => this.postsService.getById(id))
    ),
    { initialValue: null }
  );


  goBack () {
    this.router.navigate(['/'])
  }
}
