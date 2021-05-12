import { JsAuditDto } from './types'
import { axiosApi } from '../api'

export const jsAuditApi = {
    getAuditResult: async (): Promise<JsAuditDto> => {
        const res = await axiosApi.get('/services/audit/es')

        return res.data
    },
}
