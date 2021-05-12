import { combine, createDomain, forward } from 'effector'
import { createReEffect } from 'effector-reeffect'
import { createGate } from 'effector-react'
import { summaryApi, SummaryInfoDto } from '../../api/summary-api'

const getSummariesFx = createReEffect({ handler: summaryApi.getSummary })

const gate = createGate()

const summaryDomain = createDomain()

const destroy = summaryDomain.createEvent()

summaryDomain.onCreateStore((store) => store.reset(destroy))

const $summaries = summaryDomain.createStore<SummaryInfoDto[]>([])
$summaries.on(getSummariesFx.doneData, (_, summaries) => summaries)

forward({ from: gate.open, to: getSummariesFx })
forward({ from: gate.close, to: destroy })
forward({ from: destroy, to: getSummariesFx.cancel })

export const summaryModel = {
    gate,
    summaryData: combine({
        summaries: $summaries,
        isLoading: getSummariesFx.pending,
    })
}
