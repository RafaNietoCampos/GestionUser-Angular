import { CommonModule } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { SearchBoxComponent } from "@app/components/form/search-box"
import { ArrowIcon } from "@app/components/icons/arrow"
import { Image } from '@app/components/image/image'
import { AuthService } from '@app/services/auth.service'
import { PostsService } from '@app/services/posts.service'
import type { Post } from '@app/types/post'



@Component({
  selector: 'app-home',
  imports: [CommonModule, SearchBoxComponent, ArrowIcon, Image],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  authService = inject(AuthService)
  router = inject(Router)

  private newsService = inject(PostsService)

  newsList = signal<Array<Post>>([])

  today = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  private timer?: ReturnType<typeof setTimeout>

  constructor() {

    this.newsService.getAll().subscribe({
      next: news =>{
        this.newsList.set(news)
      }
    })
  }

  navigateToNews (newsId: number) {
    this.router.navigate(['/news', newsId])
  }

  searchTerm = signal('');

  filteredNews = computed(() => {
    const term = this.searchTerm().toLowerCase().trim()
    if (!term) return this.newsList()

    return this.newsList().filter(item =>
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    )
  });

  onInput (value: string) {
    // Debounce
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.searchTerm.set(value.length < 3 ? '' : value) // ← Actualiza signal
    }, 150)
  }

  protected readonly JSON = JSON;
}
