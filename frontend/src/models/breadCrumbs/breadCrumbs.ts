import { createDomain } from 'effector'

type Path = {
    title: string
    path: string
}

const breadCrumbsDomain = createDomain()

const setPath = breadCrumbsDomain.createEvent<Path>()
const addPath = breadCrumbsDomain.createEvent<Path>()
const addFullPath = breadCrumbsDomain.createEvent<Path[]>()

const $path = breadCrumbsDomain
    .createStore<Path[]>([])
    .on(setPath, (_, path) => [path])
    .on(addPath, (path, newPath) => [...path, newPath])
    .on(addFullPath, (path, fullPath) => [...path, ...fullPath])

$path.watch(console.log)

export const breadCrumbsModel = {
    $path,
    addPath,
    setPath,
    addFullPath,
}
