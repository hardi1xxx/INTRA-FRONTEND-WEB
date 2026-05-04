import { UpsertStatusProjectRequest } from "@/app/(postlogin)/master/status-project/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getDropdownStatusProject =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "/master/statusProject/show",
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
const getStatusProjectDatatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post(
      "/master/statusProject/show",
      {
        ...props,
      }
    );

    return response.data.result;
  };

// update status
const updateStatusStatusProject =
  (axios: AxiosInstance) =>
  async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
    const response = await axios.put(
      `/master/statusProject/update-status/${id}`,
      {
        status,
      }
    );

    return response.data.message;
  };

// create new data
const createStatusProject =
  (axios: AxiosInstance) =>
  async (props: UpsertStatusProjectRequest): Promise<string> => {
    const response = await axios.post(
      `/master/statusProject/insert`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// update existing data
const updateStatusProject =
  (axios: AxiosInstance) =>
  async ({
    id,
    ...props
  }: UpsertStatusProjectRequest & WithId): Promise<string> => {
    const response = await axios.put(
      `/master/statusProject/update/${id}`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// delete data
const deleteStatusProject =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.delete(
      `/master/statusProject/delete/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportStatusProject =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `/master/statusProject/excel-download`,
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
      `Master-statusProject-export-${moment().format("YYYY-MM-DD")}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    return response.data;
  };

// make a singleton services
export const StatusProjectServices = (axios: AxiosInstance) => ({
  getDropdownStatusProject: getDropdownStatusProject(axios),
  getStatusProjectDatatable: getStatusProjectDatatable(axios),
  updateStatusStatusProject: updateStatusStatusProject(axios),
  createStatusProject: createStatusProject(axios),
  updateStatusProject: updateStatusProject(axios),
  deleteStatusProject: deleteStatusProject(axios),
  exportStatusProject: exportStatusProject(axios),
});

// service type
export type StatusProjectServicesType = ReturnType<typeof StatusProjectServices>;
