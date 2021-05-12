import { SummaryInfoDto } from './types'
import { axiosApi } from '../api'

export const summaryApi = {
    getSummary: async (): Promise<SummaryInfoDto[]> => {
        const res = await axiosApi.get('/services/summary/tags')

        return res.data
    },
}
