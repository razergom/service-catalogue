import { combine, createDomain, forward } from 'effector'
import { createGate } from 'effector-react'
import { createReEffect } from 'effector-reeffect'
import { jsAuditApi, JsAuditDto } from '../../api/js-audit-api'

const getJsAuditResultsFx = createReEffect({ handler: jsAuditApi.getAuditResult })

const gate = createGate()

const jsAuditDomain = createDomain()

const destroy = jsAuditDomain.createEvent()

jsAuditDomain.onCreateStore((store) => store.reset(destroy))

const $jsAuditResults = jsAuditDomain.createStore<JsAuditDto | null>(null)
$jsAuditResults.on(getJsAuditResultsFx.doneData, (_, auditResults) => auditResults)

forward({ from: gate.open, to: getJsAuditResultsFx })
forward({ from: gate.close, to: destroy })
forward({ from: destroy, to: getJsAuditResultsFx.cancel })

export const jsAuditModel = {
    gate,
    auditPageData: combine({
        jsAuditResults: $jsAuditResults,
        isLoading: getJsAuditResultsFx.pending,
    }),
}
