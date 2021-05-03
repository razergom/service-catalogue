import { createDomain } from 'effector'

type Path = {
    title: string
    path: string
}

const breadcrumbsDomain = createDomain('bread crumbs')

const setPath = breadcrumbsDomain.createEvent<Path>()
const addPath = breadcrumbsDomain.createEvent<Path>()
const addFullPath = breadcrumbsDomain.createEvent<Path[]>()

const $path = breadcrumbsDomain
    .createStore<Path[]>([])
    .on(addPath, (path, item) => [...path, item])
    .on(setPath, (_, path) => [path])
    .on(addFullPath, (path, fullPath) => [...path, ...fullPath])

export const breadcrumbsModel = {
    $path,
    addPath,
    setPath,
    addFullPath,
}
