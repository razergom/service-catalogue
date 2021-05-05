import { ConcreteServiceDto, RegisterServiceDto, ServiceDto, ServiceId } from './types'
import { axiosApi } from '../api'

export const servicesApi = {
    getServices: async (): Promise<ServiceDto[]> => {
        const res = await axiosApi.get('/services')

        return res.data
    },

    getById: async (id: ServiceId): Promise<ConcreteServiceDto> => {
        const res = await axiosApi.get(`/services/${id}`)

        return res.data
    },

    registerService: async (registerServiceData: RegisterServiceDto): Promise<ServiceDto> => {
        const res = await axiosApi.post('/services/register', registerServiceData)

        return res.data
    },

    removeService: async (id: ServiceId): Promise<void> => {
        await axiosApi.delete(`/services/${id}`)
    }
}