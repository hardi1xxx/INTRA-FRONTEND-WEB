import { UpsertRegionalRequest } from "@/app/(postlogin)/master/regional/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getDropdownRegional =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "/master/regional/show",
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
const getRegionalDatatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post(
      "/master/regional/show",
      {
        ...props,
      }
    );

    return response.data.data;
  };

// update status
const updateStatusRegional =
  (axios: AxiosInstance) =>
  async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
    const response = await axios.put(
      `/master/regional/update-status/${id}`,
      {
        status,
      }
    );

    return response.data.message;
  };

// create new data
const createRegional =
  (axios: AxiosInstance) =>
  async (props: UpsertRegionalRequest): Promise<string> => {
    const response = await axios.post(
      `/master/regional/insert`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// update existing data
const updateRegional =
  (axios: AxiosInstance) =>
  async ({
    id,
    ...props
  }: UpsertRegionalRequest & WithId): Promise<string> => {
    const response = await axios.put(
      `/master/regional/update/${id}`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// delete data
const deleteRegional =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.delete(
      `/master/regional/delete/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportRegional =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `/master/regional/excel-download`,
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
      `Master-regional-export-${moment().format("YYYY-MM-DD")}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    return response.data;
  };

// make a singleton services
export const RegionalServices = (axios: AxiosInstance) => ({
  getDropdownRegional: getDropdownRegional(axios),
  getRegionalDatatable: getRegionalDatatable(axios),
  updateStatusRegional: updateStatusRegional(axios),
  createRegional: createRegional(axios),
  updateRegional: updateRegional(axios),
  deleteRegional: deleteRegional(axios),
  exportRegional: exportRegional(axios),
});

// service type
export type RegionalServicesType = ReturnType<typeof RegionalServices>;
