import { combine, createDomain, forward } from 'effector'
import { createGate } from 'effector-react'
import { createReEffect } from 'effector-reeffect'
import { jsAuditApi, JsAuditDto } from '../../api/js-audit-api'

const getJsAuditResultsFx = createReEffect({ handler: jsAuditApi.getAuditResult })

const gate = createGate()

const jsAuditDomain = createDomain()

const destroy = jsAuditDomain.createEvent()

const onChangeSearchString = jsAuditDomain.createEvent<string>()

jsAuditDomain.onCreateStore((store) => store.reset(destroy))

const $jsAuditResults = jsAuditDomain.createStore<JsAuditDto | null>(null)

const $searchString = jsAuditDomain.createStore<string>('')

$jsAuditResults.on(getJsAuditResultsFx.doneData, (_, auditResults) => auditResults)

$searchString.on(onChangeSearchString, (_, value) => value)

forward({ from: gate.open, to: getJsAuditResultsFx })
forward({ from: gate.close, to: destroy })
forward({ from: destroy, to: getJsAuditResultsFx.cancel })

export const jsAuditModel = {
    gate,
    onChangeSearchString,
    auditPageData: combine({
        jsAuditResults: $jsAuditResults,
        searchString: $searchString,
        isLoading: getJsAuditResultsFx.pending,
    }),
}
