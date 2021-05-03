import { RegisterServiceDto, ServiceDto } from './types'
import { axiosApi } from '../api'

export const servicesApi = {
    getServices: async (): Promise<ServiceDto[]> => {
        const res = await axiosApi.get('/services')

        return res.data
    },

    registerService: async (registerServiceData: RegisterServiceDto): Promise<ServiceDto> => {
        const res = await axiosApi.post('/services/register', registerServiceData)

        return res.data
    }
}