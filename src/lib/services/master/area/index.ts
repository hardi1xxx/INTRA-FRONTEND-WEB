import { UpsertAreaRequest } from "@/app/(postlogin)/master/area/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getDropdownArea =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "/master/area/show",
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
const getAreaDatatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post(
      "/master/area/show",
      {
        ...props,
      }
    );

    return response.data.result;
  };

// update status
const updateStatusArea =
  (axios: AxiosInstance) =>
  async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
    const response = await axios.put(
      `/master/area/update-status/${id}`,
      {
        status,
      }
    );

    return response.data.message;
  };

// create new data
const createArea =
  (axios: AxiosInstance) =>
  async (props: UpsertAreaRequest): Promise<string> => {
    const response = await axios.post(
      `/master/area/insert`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// update existing data
const updateArea =
  (axios: AxiosInstance) =>
  async ({
    id,
    ...props
  }: UpsertAreaRequest & WithId): Promise<string> => {
    const response = await axios.put(
      `/master/area/update/${id}`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// delete data
const deleteArea =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.delete(
      `/master/area/delete/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportArea =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `/master/area/excel-download`,
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
      `Master-area-export-${moment().format("YYYY-MM-DD")}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    return response.data;
  };

// make a singleton services
export const AreaServices = (axios: AxiosInstance) => ({
  getDropdownArea: getDropdownArea(axios),
  getAreaDatatable: getAreaDatatable(axios),
  updateStatusArea: updateStatusArea(axios),
  createArea: createArea(axios),
  updateArea: updateArea(axios),
  deleteArea: deleteArea(axios),
  exportArea: exportArea(axios),
});

// service type
export type AreaServicesType = ReturnType<typeof AreaServices>;
