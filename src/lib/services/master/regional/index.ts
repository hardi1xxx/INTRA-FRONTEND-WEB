import { UpsertRegionalRequest } from "@/app/(postlogin)/master/regional/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, GetFilterOptionsRequest, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getFilterRegional =
  (axios: AxiosInstance) =>
  async (
    props: GetFilterOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "v1/master/regional/filter",
      {
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

const getDropdownRegional =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "v1/master/regional/dropdown",
      {
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
      "v1/master/regional/show",
      {
        ...props,
      }
    );

    return response.data.data;
  };

// get data table
const getRegionalByID =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.get(
      `v1/master/regional/detail/${id}`
    );

    return response.data;
  };

// update status
const updateStatusRegional =
  (axios: AxiosInstance) =>
  async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
    const response = await axios.put(
      `v1/master/regional/update-status/${id}`,
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
      `v1/master/regional/create`,
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
      `v1/master/regional/update/${id}`,
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
      `v1/master/regional/delete/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportRegional =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `v1/master/regional/export`,
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
      `Master-Regional-export-${moment().format("YYYY-MM-DD")}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    return response.data;
  };

// make a singleton services
export const RegionalServices = (axios: AxiosInstance) => ({
  getDropdownRegional: getDropdownRegional(axios),
  getFilterRegional: getFilterRegional(axios),
  getRegionalDatatable: getRegionalDatatable(axios),
  getRegionalByID: getRegionalByID(axios),
  updateStatusRegional: updateStatusRegional(axios),
  createRegional: createRegional(axios),
  updateRegional: updateRegional(axios),
  deleteRegional: deleteRegional(axios),
  exportRegional: exportRegional(axios),
});

// service type
export type RegionalServicesType = ReturnType<typeof RegionalServices>;
