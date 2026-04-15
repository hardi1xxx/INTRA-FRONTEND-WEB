import { UpsertWitelRequest } from "@/app/(postlogin)/master/witel/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getDropdownWitel =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "/master/witel/show",
      {
        type: "dropdown",
        ...props,
      }
    );

    const options = (response.data.result as Record<string, any>[]).map(
      (item) => ({
        value: item[props.column],
        label: item[props.column],
      })
    );

    return options;
  };

// get data table
const getWitelDatatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post(
      "/master/witel/show",
      {
        ...props,
      }
    );

    return response.data.result;
  };

// update status
const updateStatusWitel =
  (axios: AxiosInstance) =>
  async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
    const response = await axios.put(
      `/master/witel/update-status/${id}`,
      {
        status,
      }
    );

    return response.data.message;
  };

// create new data
const createWitel =
  (axios: AxiosInstance) =>
  async (props: UpsertWitelRequest): Promise<string> => {
    const response = await axios.post(
      `/master/witel/insert`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// update existing data
const updateWitel =
  (axios: AxiosInstance) =>
  async ({
    id,
    ...props
  }: UpsertWitelRequest & WithId): Promise<string> => {
    const response = await axios.put(
      `/master/witel/update/${id}`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// delete data
const deleteWitel =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.delete(
      `/master/witel/delete/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportWitel =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `/master/witel/excel-download`,
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
      `Master-Witel-export-${moment().format("YYYY-MM-DD")}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    return response.data;
  };

// make a singleton services
export const WitelServices = (axios: AxiosInstance) => ({
  getDropdownWitel: getDropdownWitel(axios),
  getWitelDatatable: getWitelDatatable(axios),
  updateStatusWitel: updateStatusWitel(axios),
  createWitel: createWitel(axios),
  updateWitel: updateWitel(axios),
  deleteWitel: deleteWitel(axios),
  exportWitel: exportWitel(axios),
});

// service type
export type WitelServicesType = ReturnType<typeof WitelServices>;
