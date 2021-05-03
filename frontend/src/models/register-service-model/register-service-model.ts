import { combine, createDomain, forward, sample } from 'effector'
import { createReEffect } from 'effector-reeffect'
import { servicesApi } from '../../api/services-api'
import {toastsModel} from "../toasts-model";
import {servicesModel} from "../services-model";

const registerServiceFx = createReEffect({ handler: servicesApi.registerService })

const registerServiceDomain = createDomain()

const destroy = registerServiceDomain.createEvent()

registerServiceDomain.onCreateStore(store => store.reset(destroy))

const openModal = registerServiceDomain.createEvent()
const closeModal = registerServiceDomain.createEvent()

const urlChanged = registerServiceDomain.createEvent<string>()

const registerServiceClicked = registerServiceDomain.createEvent()

const $isOpened = registerServiceDomain.createStore<boolean>(false)

const $configUrl = registerServiceDomain.createStore<string>('')

$isOpened
    .on(openModal, (_) => true)
    .reset(closeModal)

$configUrl.on(urlChanged, (_, value) => value)

sample({
    source: $configUrl,
    clock: registerServiceClicked,
    target: registerServiceFx,
    fn: (configUrl) => ({ url: configUrl })
})

forward({ from: [registerServiceFx.done, closeModal], to: destroy })

registerServiceFx.done.watch(() => {
    servicesModel.updateServices()
    toastsModel.notifySuccess({ text: 'service registered' })
})

registerServiceFx.failData.watch(toastsModel.notifyNativeError)

const $isPending = registerServiceFx.pending

export const registerServiceModel = {
    modalData: combine({
        configUrl: $configUrl,
        isOpened: $isOpened,
        isPending: $isPending,
    }),
    openModal,
    closeModal,
    urlChanged,
    registerServiceClicked,
}
