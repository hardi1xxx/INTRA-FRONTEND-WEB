import { UpsertMitraRequest } from "@/app/(postlogin)/master/mitra/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getDropdownMitra =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "/master/mitra/show",
      {
        type: "dropdown",
        ...props,
      }
    );

    const options = (response.data.data as Record<string, any>[]).map(
      (item) => ({
        value: item[props.column],
        label: item[props.column],
      })
    );

    return options;
  };

// get data table
const getMitraDatatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post(
      "/master/mitra/show",
      {
        ...props,
      }
    );

    return response.data.data;
  };

// update status
const updateStatusMitra =
  (axios: AxiosInstance) =>
  async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
    const response = await axios.put(
      `/master/mitra/update-status/${id}`,
      {
        status,
      }
    );

    return response.data.message;
  };

// create new data
const createMitra =
  (axios: AxiosInstance) =>
  async (props: UpsertMitraRequest): Promise<string> => {
    const response = await axios.post(
      `/master/mitra/insert`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// update existing data
const updateMitra =
  (axios: AxiosInstance) =>
  async ({
    id,
    ...props
  }: UpsertMitraRequest & WithId): Promise<string> => {
    const response = await axios.put(
      `/master/mitra/update/${id}`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// delete data
const deleteMitra =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.delete(
      `/master/mitra/delete/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportMitra =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `/master/mitra/excel-download`,
      {
        ...props,
      },
      {
        responseType: "blob",
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Master-mitra-export-${moment().format("YYYY-MM-DD")}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    return response.data;
  };

// make a singleton services
export const MitraServices = (axios: AxiosInstance) => ({
  getDropdownMitra: getDropdownMitra(axios),
  getMitraDatatable: getMitraDatatable(axios),
  updateStatusMitra: updateStatusMitra(axios),
  createMitra: createMitra(axios),
  updateMitra: updateMitra(axios),
  deleteMitra: deleteMitra(axios),
  exportMitra: exportMitra(axios),
});

// service type
export type MitraServicesType = ReturnType<typeof MitraServices>;
