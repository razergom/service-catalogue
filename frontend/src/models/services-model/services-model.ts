import { createDomain, forward } from 'effector'
import { createReEffect } from 'effector-reeffect'
import { createGate } from 'effector-react'
import { ServiceDto, servicesApi } from '../../api/services-api'

const getServicesFx = createReEffect({ handler: servicesApi.getServices })

const gate = createGate()
const servicesDomain = createDomain()

const destroy = servicesDomain.createEvent()

servicesDomain.onCreateStore((store) => store.reset(destroy))

const $services = servicesDomain.createStore<ServiceDto[]>([])

$services.on(getServicesFx.doneData, (_, services) => services)

$services.watch(console.log)

forward({ from: gate.open, to: getServicesFx })
forward({ from: gate.close, to: destroy })

export const servicesModel = {
    gate,
    $services,
}
