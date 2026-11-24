import { Component, computed, effect, inject, output, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { XIcon } from '@app/components/icons/x'
import { ImagesService } from '@app/services/images.service'
import { PostsService } from '@app/services/posts.service'
import { ToastService } from '@app/services/toast.service'
import type { CreatePost, Post } from '@app/types/post'
import { firstValueFrom } from 'rxjs'

@Component({
  selector: 'app-post-modal',
  imports: [XIcon, ReactiveFormsModule],
  templateUrl: './create-post-modal.html',
})
export class PostModal {
  private postsService = inject(PostsService)
  private imageService = inject(ImagesService)
  private toastService = inject(ToastService)
  private fb = new FormBuilder();

  onClose = output<void>()
  onSuccess = output<Post>()
  onCancel = output<void>()

  protected isActive = signal<boolean>(false)
  protected post = signal<Post | null>(null)
  protected isEdit = signal<boolean>(false)

  protected modalTitle = computed(() => this.isEdit() ? 'Editar noticia' : 'Añadir noticia');


  protected form = this.fb.nonNullable.group({
    id: this.fb.control<number | null>(null),
    title: ['', [Validators.required, Validators.minLength(6)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    imageFile: this.fb.control<File | null>(null, { validators: [Validators.required] })
  });

  constructor() {
    effect(() => {
      const edit = this.isEdit()

      const imageCtrl = this.form.controls.imageFile

      if (edit) {
        imageCtrl.clearValidators()
      } else {
        imageCtrl.setValidators([Validators.required])
      }

      imageCtrl.updateValueAndValidity({ onlySelf: true })
    })

    effect(() => {
      const post = this.post()
      if (post) {
        this.form.patchValue({
          id: post.id ?? null,
          title: post.title ?? '',
          description: post.description ?? '',
        })
      }
    })
  }

  protected async onSave() {
    if (this.form.valid) {
      const { imageFile, ...postData } = this.form.getRawValue()


      if (this.isEdit()) {
        const imageId = imageFile ? (await this.uploadImage(imageFile)) : null

        // si intentó subir una nueva imagen y falló, no continuamos
        if (imageFile && !imageId) return

        // sin imagen nueva no se envía imageId, para conservar la actual
        const payload: CreatePost = {
          id: this.post()?.id,
          title: postData.title,
          description: postData.description,
          ...(imageId && { imageId }),
        }

        this.postsService.update(payload).subscribe({
          next: (value) => {
            this.onSuccess.emit(value)
            this.toastService.success('Noticia actualizada correctamente.')
          },
          error: () => {
            this.toastService.error('Error al actualizar la noticia.')
          },
          complete: () => {
            this.closeModal()
          },
        })

      } else {
        if (!imageFile) {
          this.form.controls.imageFile.markAsTouched()
          return
        }

        const imageId = await this.uploadImage(imageFile)
        if (!imageId) return

        // 2) Crear noticia
        const payload = {
          title: postData.title,
          description: postData.description,
          imageId,
        } satisfies CreatePost

        this.postsService.create(payload).subscribe({
          next: (value) => {
            this.onSuccess.emit(value)
            this.toastService.success('Noticia publicada correctamente.')
          },
          error: () => {
            this.toastService.error('Error al publicar la noticia.')
          },
          complete: () => {
            this.closeModal()
          },
        })
      }
    }
  }

  protected onBackdropClick() {
    this.closeModal()
  }

  closeModal() {
    this.isActive.set(false)
    this.isEdit.set(false)
    this.post.set(null)
    this.form.reset()
  }

  openModal(post?: Post) {
    if (post) {
      this.isEdit.set(true)
      this.post.set(post)
    }
    this.isActive.set(true)
  }


  private async uploadImage(imageFile: File): Promise<number | null> {
    const formData = new FormData()
    formData.append('image', imageFile)

    const imageResponse = await firstValueFrom(this.imageService.createImage(formData))


    if (!imageResponse?.id) {
      this.toastService.error('Hubo un problema al subir la imagen.')
      return null
    }

    return imageResponse.id
  }
}
