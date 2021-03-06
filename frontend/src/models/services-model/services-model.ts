import { combine, createDomain, forward, sample, guard } from 'effector'
import { createReEffect } from 'effector-reeffect'
import { createGate } from 'effector-react'
import { ServiceDto, ServiceId, servicesApi } from '../../api/services-api'
import { toastsModel } from '../toasts-model'

const getServicesFx = createReEffect({ handler: servicesApi.getServices })
const removeServiceFx = createReEffect({ handler: servicesApi.removeService })

const gate = createGate()
const servicesDomain = createDomain()

const destroy = servicesDomain.createEvent()

const openRemoveConfirmationModal = servicesDomain.createEvent<ServiceId>()
const closeRemoveConfirmationModal = servicesDomain.createEvent()

const updateServices = servicesDomain.createEvent()

const onChangeSearchString = servicesDomain.createEvent<string>()

const removeService = servicesDomain.createEvent()

servicesDomain.onCreateStore((store) => store.reset(destroy))

const $services = servicesDomain.createStore<ServiceDto[]>([])

const $idOfRemoved = servicesDomain.createStore<ServiceId | null>(null)

const $searchString = servicesDomain.createStore<string>('')

const $removeConfirmationModalIsOpened = servicesDomain.createStore<boolean>(false)

$services.on(getServicesFx.doneData, (_, services) => services)

$searchString
    .on(onChangeSearchString, (_, value) => value)

$idOfRemoved
    .on(openRemoveConfirmationModal, (_, id) => id)
    .reset([closeRemoveConfirmationModal, removeServiceFx.done])

$removeConfirmationModalIsOpened
    .on(openRemoveConfirmationModal, (_) => true)
    .reset([closeRemoveConfirmationModal, removeServiceFx.done])

const $canRemove = $idOfRemoved.map(id => id !== null).reset([closeRemoveConfirmationModal, destroy])

sample({
    source: combine({ services: $services, searchString: $searchString }),
    clock: [$searchString.updates, getServicesFx.done],
    target: $services,
    fn: ({ services, searchString }) =>
        services.map(service => {
            service.searchFlag = service.name.trim().toLowerCase().includes(searchString.trim().toLowerCase())

            return service
        })
})

guard({
    source: sample($idOfRemoved, removeService),
    filter: $canRemove,
    //@ts-ignore
    target: removeServiceFx,
})

forward({ from: [gate.open, updateServices, removeServiceFx.done], to: getServicesFx })
forward({ from: gate.close, to: destroy })
forward({ from: destroy, to: [getServicesFx.cancel, removeServiceFx.cancel] })

removeServiceFx.done.watch(() => toastsModel.notifySuccess({ text: 'service removed' }))
removeServiceFx.failData.watch(toastsModel.notifyNativeError)

const $isLoading = getServicesFx.pending
const $isRemoving = removeServiceFx.pending

export const servicesModel = {
    gate,
    updateServices,
    openRemoveConfirmationModal,
    closeRemoveConfirmationModal,
    removeService,
    onChangeSearchString,
    pageData: combine({
        services: $services,
        searchString: $searchString,
        removeConfirmationModalIsOpened: $removeConfirmationModalIsOpened,
        isLoading: $isLoading,
        isRemoving: $isRemoving,
    }),
}
