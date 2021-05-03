export type ServiceId = string

export type ServiceDto = {
    _id: ServiceId
    name: string
    description: string
    version: string
    tags: string[]
    links: {
      url: string
      title: string
    }[]
    spec: {
        type: string
        lifecycle: string
        owner: string
    }
    searchFlag?: boolean
}

export type RegisterServiceDto = {
    url: string
}
