import { Component, computed, effect, inject, output, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { XIcon } from '@app/components/icons/x'
import { GrupoService } from '@app/services/grupo.service'
import { ImagesService } from '@app/services/images.service'
import { ToastService } from '@app/services/toast.service'
import { CreateGroup, Group, UpdateGroupPayload } from '@app/types/group'
import { firstValueFrom } from 'rxjs'

@Component({
  selector: 'app-grupo-modal',
  imports: [XIcon, ReactiveFormsModule],
  templateUrl: './create-grupo-modal.html',
})
export class GrupoModal {
  private grupoService = inject(GrupoService)
  private imageService = inject(ImagesService)
  private toastService = inject(ToastService)
  private fb = new FormBuilder();

  onClose = output<void>()
  onSuccess = output<Group>()
  onCancel = output<void>()

  protected isActive = signal<boolean>(false)
  protected grupo = signal<Group | null>(null)
  protected isEdit = signal<boolean>(false)

  protected modalTitle = computed(() => this.isEdit() ? 'Editar grupo' : 'Añadir grupo');


  protected form = this.fb.nonNullable.group({
    id: this.fb.control<number | null>(null),
    name: ['', [Validators.required, Validators.minLength(6)]],
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
      const grupo = this.grupo()
      if (grupo) {
        this.form.patchValue({
          id: grupo.id ?? null,
          name: grupo.name ?? '',
          description: grupo.description ?? '',
        })
      }
    })
  }

  protected async onSave() {
    if (this.form.valid) {
      const { imageFile, ...groupData } = this.form.getRawValue()


      if (this.isEdit()) {
        const imageId = imageFile
          ? await this.uploadImage(imageFile)
          : undefined

        // si intentó subir una nueva imagen y falló, no continuamos
        if (imageFile && imageId === undefined) return

        const payload: UpdateGroupPayload = {
          id: this.grupo()!.id,
          name: groupData.name,
          description: groupData.description,
          ...(imageId !== undefined && { imageId }),
        }

        this.grupoService.putGroup(this.grupo()!.id, payload).subscribe({
          next: (value) => {
            this.onSuccess.emit(value)
            this.toastService.success('Grupo actualizado correctamente.')
          },
          error: () => {
            this.toastService.error('Error al actualizar el grupo.')
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
        if (imageId === undefined) return

        // 2) Crear grupo
        const payload: CreateGroup = {
          name: groupData.name,
          description: groupData.description,
          imageId,
        }

        this.grupoService.postGroup(payload).subscribe({
          next: (value) => {
            this.onSuccess.emit(value)
            this.toastService.success('Grupo publicado correctamente.')
          },
          error: () => {
            this.toastService.error('Error al publicar el grupo.')
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
    this.grupo.set(null)
    this.form.reset()
  }

  openModal(grupo?: Group) {
    if (grupo) {
      this.isEdit.set(true)
      this.grupo.set(grupo)
    }
    this.isActive.set(true)
  }


  private async uploadImage(imageFile: File): Promise<number | undefined> {
    const formData = new FormData()
    formData.append('image', imageFile)

    const imageResponse = await firstValueFrom(this.imageService.createImage(formData))


    if (!imageResponse?.id) {
      this.toastService.error('Hubo un problema al subir la imagen.')
      return undefined
    }

    return imageResponse.id
  }
}
