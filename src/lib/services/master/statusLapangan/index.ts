import { UpsertStatusLapanganRequest } from "@/app/(postlogin)/master/status-lapangan/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getDropdownStatusLapangan =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "/master/status-lapangan/show",
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
const getStatusLapanganDatatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post(
      "/master/status-lapangan/show",
      {
        ...props,
      }
    );

    return response.data.result;
  };

// update status
const updateStatusStatusLapangan =
  (axios: AxiosInstance) =>
  async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
    const response = await axios.put(
      `/master/status-lapangan/update-status/${id}`,
      {
        status,
      }
    );

    return response.data.message;
  };

// create new data
const createStatusLapangan =
  (axios: AxiosInstance) =>
  async (props: UpsertStatusLapanganRequest): Promise<string> => {
    const response = await axios.post(
      `/master/status-lapangan/insert`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// update existing data
const updateStatusLapangan =
  (axios: AxiosInstance) =>
  async ({
    id,
    ...props
  }: UpsertStatusLapanganRequest & WithId): Promise<string> => {
    const response = await axios.put(
      `/master/status-lapangan/update/${id}`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// delete data
const deleteStatusLapangan =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.delete(
      `/master/status-lapangan/delete/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportStatusLapangan =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `/master/status-lapangan/excel-download`,
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
      `Master-Status-Lapangan-export-${moment().format("YYYY-MM-DD")}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    return response.data;
  };

// make a singleton services
export const StatusLapanganServices = (axios: AxiosInstance) => ({
  getDropdownStatusLapangan: getDropdownStatusLapangan(axios),
  getStatusLapanganDatatable: getStatusLapanganDatatable(axios),
  updateStatusStatusLapangan: updateStatusStatusLapangan(axios),
  createStatusLapangan: createStatusLapangan(axios),
  updateStatusLapangan: updateStatusLapangan(axios),
  deleteStatusLapangan: deleteStatusLapangan(axios),
  exportStatusLapangan: exportStatusLapangan(axios),
});

// service type
export type StatusLapanganServicesType = ReturnType<typeof StatusLapanganServices>;
