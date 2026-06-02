export type Post = {
  id: number
  title: string
  description: string
  imageUrl: string
}

export type CreatePost = Pick<Post, 'description' | 'title'> & { id?: Post['id'], imageId?: number | null }
