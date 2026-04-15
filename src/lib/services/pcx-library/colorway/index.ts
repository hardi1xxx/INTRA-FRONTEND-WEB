import { AxiosInstance } from "axios"
import { DefaultServiceResponse } from "../.."
import { DataMasterColorway } from "@/lib/redux/slices/pcxLibrary/colorway"

export type DataDropdownMasterColorway = {
    column: "colorway_id" | "org_id" | "nike_colorway_id" | "nike_colorway_code" | "nike_colorway_name" | "colorway_type" | "colorway_status" | "colorway_state",
    colorway_id?: string | null,
    org_id?: string | null,
    nike_colorway_id?: string | null,
    nike_colorway_code?: string | null,
    nike_colorway_name?: string | null,
    colorway_type?: string | null,
    colorway_status?: string | null,
    colorway_state?: string | null,
}

export type DataFilterMasterColorway = {
    colorway_id: string,
    org_id: string,
    nike_colorway_id: string,
    nike_colorway_code: string,
    nike_colorway_name: string,
    colorway_type: string,
    colorway_status: string,
    colorway_state: string,
    start: number
    length: number
    search: string
    order_param: string
}

export type DataFilterExportMasterColorway = {
    colorway_id: string,
    org_id: string,
    nike_colorway_id: string,
    nike_colorway_code: string,
    nike_colorway_name: string,
    colorway_type: string,
    colorway_status: string,
    colorway_state: string
}

export type DataUploadMasterColorwayResponseType = {
    valid: DataMasterColorway[],
    invalid: (DataMasterColorway & { error_message: string })[]
}

export const getDataDropdownColorwayService = (axios: AxiosInstance) => async (data: DataDropdownMasterColorway): Promise<DefaultServiceResponse & { result: any[] }> => {
    try {
        const filter_param = `colorway_id,${data.colorway_id ?? ''}|org_id,${data.org_id ?? ''}|nike_colorway_id,${data.nike_colorway_id ?? ''}|nike_colorway_code,${data.nike_colorway_code ?? ''}|nike_colorway_name,${data.nike_colorway_name ?? ''}|colorway_type,${data.colorway_type ?? ''}|colorway_status,${data.colorway_status ?? ''}|colorway_state,${data.colorway_state ?? ''}`

        const response = await axios.post(`/master/colorway/show?t=${new Date().getTime()}`, {
            type: "dropdown",
            column: data.column,
            filter_param,
            order_param: `${data.column},asc`
        })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const getColorwayService = (axios: AxiosInstance) => async (data: DataFilterMasterColorway): Promise<DefaultServiceResponse & { result: { data: DataMasterColorway[], recordsTotal: number, recordsFilter: number } }> => {
    try {
        const filter_param = `colorway_id,${data.colorway_id ?? ''}|org_id,${data.org_id ?? ''}|nike_colorway_id,${data.nike_colorway_id ?? ''}|nike_colorway_code,${data.nike_colorway_code ?? ''}|nike_colorway_name,${data.nike_colorway_name ?? ''}|colorway_type,${data.colorway_type ?? ''}|colorway_status,${data.colorway_status ?? ''}|colorway_state,${data.colorway_state ?? ''}`

        const response = await axios.post(`/master/colorway/show`, {
            type: "table",
            filter_param,
            start: data.start,
            length: data.length,
            order_param: data.order_param,
            search: data.search
        })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const exportExcelColorwayService = (axios: AxiosInstance) => async (data: DataFilterExportMasterColorway): Promise<Blob> => {
    try {
        const filter_param = `colorway_id,${data.colorway_id ?? ''}|org_id,${data.org_id ?? ''}|nike_colorway_id,${data.nike_colorway_id ?? ''}|nike_colorway_code,${data.nike_colorway_code ?? ''}|nike_colorway_name,${data.nike_colorway_name ?? ''}|colorway_type,${data.colorway_type ?? ''}|colorway_status,${data.colorway_status ?? ''}|colorway_state,${data.colorway_state ?? ''}`

        const response = await axios.post(`/master/colorway/export-excel`, {
            type: "table",
            filter_param,
        }, {
            responseType: 'blob'
        })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const createColorwayService = (axios: AxiosInstance) => async (data: DataMasterColorway): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.post(`/master/colorway/insert`, data)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const updateColorwayService = (axios: AxiosInstance) => async (id: number, data: DataMasterColorway): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.put(`/master/colorway/update/${id}`, data)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const deleteColorwayService = (axios: AxiosInstance) => async (id: number): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.delete(`/master/colorway/delete/${id}`)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const downloadTemplateColorwayService = (axios: AxiosInstance) => async (): Promise<Blob> => {
    try {
        const response = await axios.post(`/master/colorway/template-excel`, {}, {
            responseType: 'blob'
        })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const uploadColorwayService = (axios: AxiosInstance) => async (file: File): Promise<DefaultServiceResponse & { result: DataUploadMasterColorwayResponseType }> => {
    try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await axios.post(`/master/colorway/upload-excel`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const insertFileColorwayService = (axios: AxiosInstance) => async (data: DataMasterColorway[]): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.post(`/master/colorway/insert-excel`, { data })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export type ColorwayServiceType = {
    getDataDropdownColorway: (data: DataDropdownMasterColorway) => Promise<DefaultServiceResponse & { result: any[] }>,
    getColorway: (data: DataFilterMasterColorway) => Promise<DefaultServiceResponse & { result: { data: DataMasterColorway[], recordsTotal: number, recordsFilter: number } }>,
    exportExcelColorway: (data: DataFilterExportMasterColorway) => Promise<Blob>
    createColorway: (data: DataMasterColorway) => Promise<DefaultServiceResponse>
    updateColorway: (id: number, data: DataMasterColorway) => Promise<DefaultServiceResponse>
    deleteColorway: (id: number) => Promise<DefaultServiceResponse>
    downloadTemplateColorway: () => Promise<Blob>
    uploadColorway: (file: File) => Promise<DefaultServiceResponse & { result: DataUploadMasterColorwayResponseType }>
    inserFileColorway: (data: DataMasterColorway[]) => Promise<DefaultServiceResponse>
}

export const ColorwayServices = (axiosInstanceWithToken: AxiosInstance): ColorwayServiceType => ({
    getDataDropdownColorway: getDataDropdownColorwayService(axiosInstanceWithToken),
    getColorway: getColorwayService(axiosInstanceWithToken),
    exportExcelColorway: exportExcelColorwayService(axiosInstanceWithToken),
    createColorway: createColorwayService(axiosInstanceWithToken),
    updateColorway: updateColorwayService(axiosInstanceWithToken),
    deleteColorway: deleteColorwayService(axiosInstanceWithToken),
    downloadTemplateColorway: downloadTemplateColorwayService(axiosInstanceWithToken),
    uploadColorway: uploadColorwayService(axiosInstanceWithToken),
    inserFileColorway: insertFileColorwayService(axiosInstanceWithToken)
})