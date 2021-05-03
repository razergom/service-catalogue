import { combine, createDomain, forward } from 'effector'
import { createGate } from 'effector-react'
import { createReEffect } from 'effector-reeffect'
import { ServiceDto, ServiceId, servicesApi } from '../../api/services-api'

const getServiceFx = createReEffect({ handler: servicesApi.getById })

const gate = createGate<ServiceId>()

const serviceInfoDomain = createDomain()

const destroy = serviceInfoDomain.createEvent()

serviceInfoDomain.onCreateStore((store) => store.reset(destroy))

const $service = serviceInfoDomain.createStore<ServiceDto | null>(null)

$service.on(getServiceFx.doneData, (_, service) => service)

forward({ from: gate.open, to: getServiceFx })
forward({ from: gate.close, to: destroy })

const $isLoading = getServiceFx.pending

export const serviceInfoModel = {
    gate,
    serviceInfoPage: combine({
        service: $service,
        isLoading: $isLoading,
    }),
}
