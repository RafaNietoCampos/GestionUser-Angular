export type Event = {
  id: number
  title: string
  description: string
  date: Date
  group?: {
    id: string,
    name: string
  }
}

export type CreateEvent = Pick<Event, 'title' | 'description'> & {
  date: string | Date
  groupId?: number
}
