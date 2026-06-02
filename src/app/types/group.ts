export type Group = {
    id: number
    name: string
    description: string
    imageUrl: string
}

export type CreateGroup = Pick<Group, 'name' | 'description'> & { id?: Group['id'], imageId?: number | null }

export type UpdateGroupPayload = {
    id: number
    name?: string
    description?: string
    imageId?: number
}