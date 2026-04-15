import { UpsertReportPT3Request } from "@/app/(postlogin)/report/pt3/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getDropdownReportPT3 =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "/report/pt3/show",
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
const getReportPT3Datatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post(
      "/report/pt3/show",
      {
        ...props,
      }
    );

    return response.data.result;
  };

// create new data
const createReportPT3 =
  (axios: AxiosInstance) =>
  async (props: UpsertReportPT3Request): Promise<string> => {
    const response = await axios.post(
      `/report/pt3/insert`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// import new data
const importReportPT3 =
  (axios: AxiosInstance) =>
  async (props: UpsertReportPT3Request): Promise<string> => {
    const response = await axios.post(
      `/report/pt3/import`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// update existing data
const updateReportPT3 =
  (axios: AxiosInstance) =>
  async ({
    id,
    ...props
  }: UpsertReportPT3Request & WithId): Promise<string> => {
    const response = await axios.put(
      `/report/pt3/update/${id}`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// delete data
const deleteReportPT3 =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.delete(
      `/report/pt3/delete/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportReportPT3 =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `/report/pt3/export`,
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
      `Report-PT3-export-${moment().format("YYYY-MM-DD")}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    return response.data;
  };

// make a singleton services
export const ReportPT3Services = (axios: AxiosInstance) => ({
  getDropdownReportPT3: getDropdownReportPT3(axios),
  getReportPT3Datatable: getReportPT3Datatable(axios),
  createReportPT3: createReportPT3(axios),
  importReportPT3: importReportPT3(axios),
  updateReportPT3: updateReportPT3(axios),
  deleteReportPT3: deleteReportPT3(axios),
  exportReportPT3: exportReportPT3(axios),
});

// service type
export type ReportPT3ServicesType = ReturnType<typeof ReportPT3Services>;
