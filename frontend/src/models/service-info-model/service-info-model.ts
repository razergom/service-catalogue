import {combine, createDomain, forward, sample} from 'effector'
import { createGate } from 'effector-react'
import { createReEffect } from 'effector-reeffect'
import { ConcreteServiceDto, ServiceId, servicesApi } from '../../api/services-api'
import { toastsModel } from '../toasts-model'

const getServiceFx = createReEffect({ handler: servicesApi.getById })

const gate = createGate<ServiceId>()

const serviceInfoDomain = createDomain()

const destroy = serviceInfoDomain.createEvent()

serviceInfoDomain.onCreateStore((store) => store.reset(destroy))

const onChangeSearchString = serviceInfoDomain.createEvent<string>()

const $service = serviceInfoDomain.createStore<ConcreteServiceDto | null>(null)

const $searchString = serviceInfoDomain.createStore<string>('')

$service.on(getServiceFx.doneData, (_, service) => service)

$searchString.on(onChangeSearchString, (_, value) => value)

forward({ from: gate.open, to: getServiceFx })
forward({ from: gate.close, to: destroy })
forward({ from: destroy, to: getServiceFx.cancel })

sample({
    source: combine({ service: $service, searchString: $searchString }),
    clock: [$searchString.updates, getServiceFx.done],
    target: $service,
    fn: ({ service, searchString }) => {
        service?.builds.map(build => {
            build.searchFlag = build.name.trim().toLowerCase().includes(searchString.trim().toLowerCase())

            return service
        })

        return service
    }
})

getServiceFx.failData.watch(toastsModel.notifyNativeError)

const $isLoading = getServiceFx.pending

export const serviceInfoModel = {
    gate,
    onChangeSearchString,
    serviceInfoPage: combine({
        service: $service,
        searchString: $searchString,
        isLoading: $isLoading,
    }),
}
