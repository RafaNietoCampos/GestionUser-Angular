import { CommonModule } from '@angular/common'
import { Component, computed, inject, signal, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SearchBoxComponent } from "@app/components/form/search-box"
import { AddUserIcon } from "@app/components/icons/add-user"
import { FoldersIcon } from "@app/components/icons/folders"
import { SaveIcon } from "@app/components/icons/save"
import { ImagesService } from '@app/services/images.service'
import { PostsService } from '@app/services/posts.service'
import { ToastService } from '@app/services/toast.service'
import { firstValueFrom } from 'rxjs'
import { PostModal } from "./create-post-modal/create-post-modal"
import type { Post } from '@app/types/post'

@Component({
  selector: 'app-posts-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBoxComponent, PostModal, FoldersIcon],
  templateUrl: './posts-dashboard.html',
})
export class NewsPaper {
  @ViewChild('postModal') postModal = PostModal

  imageService = inject(ImagesService);
  postsService = inject(PostsService);
  toastService = inject(ToastService);

  private timer?: ReturnType<typeof setTimeout>

  postList = signal<Array<Post>>([])
  searchTerm = signal('')
  showUserModal = false


  constructor() {
    this.postsService.getAll().subscribe({
      next: value => {
        this.postList.set(value)
      }
    })
  }

  filteredPosts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim()
    if (!term) return this.postList()

    return this.postList().filter(post => post.title.toLowerCase().includes(term))
  })

  onInput (value: string) {
    // Debounce
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.searchTerm.set(value.length < 3 ? '' : value)
    }, 150)
  }

  addPostToList (post: Post) {
    this.postList.update(value => [...value.filter(item => item.id !== post.id), post])
  }

  deletePost (post: Post) {
    this.postsService.deletePost(post.id).subscribe({
      next: () => {
        this.postList.update(value => value.filter(item => item.id !== post.id))
        this.toastService.success('Post eliminado correctamente.')
      },
      error: () => {
        this.toastService.error('No ha sido posible eliminar el post.')
      }
    })
  }
}
