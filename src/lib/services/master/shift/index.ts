import { UpsertShiftRequest } from "@/app/(postlogin)/master/shift/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getDropdownShift =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "/master/shift/show-data-shift",
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
const getShiftDatatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post(
      "/master/shift/show-data-shift",
      {
        ...props,
      }
    );

    return response.data.result;
  };

// update status
const updateStatusShift =
  (axios: AxiosInstance) =>
  async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
    const response = await axios.put(
      `/master/shift/update-status-data-shift/${id}`,
      {
        status,
      }
    );

    return response.data.message;
  };

// create new data
const createShift =
  (axios: AxiosInstance) =>
  async (props: UpsertShiftRequest): Promise<string> => {
    const response = await axios.post(
      `/master/shift/insert-data-shift`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// update existing data
const updateShift =
  (axios: AxiosInstance) =>
  async ({
    id,
    ...props
  }: UpsertShiftRequest & WithId): Promise<string> => {
    const response = await axios.put(
      `/master/shift/update-data-shift/${id}`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// delete data
const deleteShift =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.delete(
      `/master/shift/delete-data-shift/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportShift =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `/master/shift/excel-download-data-shift`,
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
      `Master-Shift-export-${moment().format("YYYY-MM-DD")}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    return response.data;
  };

// make a singleton services
export const ShiftServices = (axios: AxiosInstance) => ({
  getDropdownShift: getDropdownShift(axios),
  getShiftDatatable: getShiftDatatable(axios),
  updateStatusShift: updateStatusShift(axios),
  createShift: createShift(axios),
  updateShift: updateShift(axios),
  deleteShift: deleteShift(axios),
  exportShift: exportShift(axios),
});

// service type
export type ShiftServicesType = ReturnType<typeof ShiftServices>;
