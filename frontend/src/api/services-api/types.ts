export type ServiceId = string

export type BuildId = string

export enum BuildStatus {
    PROCESS = 'PROCESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export type BuildDto = {
    _id: BuildId
    name: string
    status: BuildStatus
    testResult: {
        status: string
        coverage: number
        testReport: {
            filename: string
            data: BinaryType
        }
    }
    changelog: {
        filename: string
        data: BinaryType
    }
    searchFlag?: boolean
}

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

export type ConcreteServiceDto = {
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
    builds: BuildDto[]
}

export type RegisterServiceDto = {
    url: string
}
