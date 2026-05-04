import { UpsertSTORequest } from "@/app/(postlogin)/master/sto/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getDropdownSTO =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "/master/sto/show",
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
const getSTODatatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post(
      "/master/sto/show",
      {
        ...props,
      }
    );

    return response.data.data;
  };

// update status
const updateStatusSTO =
  (axios: AxiosInstance) =>
  async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
    const response = await axios.put(
      `/master/sto/update-status/${id}`,
      {
        status,
      }
    );

    return response.data.message;
  };

// create new data
const createSTO =
  (axios: AxiosInstance) =>
  async (props: UpsertSTORequest): Promise<string> => {
    const response = await axios.post(
      `/master/sto/insert`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// update existing data
const updateSTO =
  (axios: AxiosInstance) =>
  async ({
    id,
    ...props
  }: UpsertSTORequest & WithId): Promise<string> => {
    const response = await axios.put(
      `/master/sto/update/${id}`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// delete data
const deleteSTO =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.delete(
      `/master/sto/delete/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportSTO =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `/master/sto/excel-download`,
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
      `Master-sto-export-${moment().format("YYYY-MM-DD")}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    return response.data;
  };

// make a singleton services
export const STOServices = (axios: AxiosInstance) => ({
  getDropdownSTO: getDropdownSTO(axios),
  getSTODatatable: getSTODatatable(axios),
  updateStatusSTO: updateStatusSTO(axios),
  createSTO: createSTO(axios),
  updateSTO: updateSTO(axios),
  deleteSTO: deleteSTO(axios),
  exportSTO: exportSTO(axios),
});

// service type
export type STOServicesType = ReturnType<typeof STOServices>;
