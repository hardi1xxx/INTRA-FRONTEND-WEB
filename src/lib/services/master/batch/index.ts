
import { UpsertBatchRequest } from "@/app/(postlogin)/master/batch/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getDropdownBatch =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "/master/batch/dropdown",
      {
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
const getBatchDatatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post(
      "/master/batch/show",
      {
        ...props,
      }
    );

    return response.data.result;
  };

// update status
const updateStatusBatch =
  (axios: AxiosInstance) =>
  async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
    const response = await axios.put(
      `/master/batch/update-status/${id}`,
      {
        status,
      }
    );

    return response.data.message;
  };

// create new data
const createBatch =
  (axios: AxiosInstance) =>
  async (props: UpsertBatchRequest): Promise<string> => {
    const response = await axios.post(
      `/master/batch/create`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// update existing data
const updateBatch =
  (axios: AxiosInstance) =>
  async ({
    id,
    ...props
  }: UpsertBatchRequest & WithId): Promise<string> => {
    const response = await axios.put(
      `/master/batch/update/${id}`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// delete data
const deleteBatch =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.delete(
      `/master/batch/delete/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportBatch =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `/master/batch/export`,
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
      `Master-Batch-export-${moment().format("YYYY-MM-DD")}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    return response.data;
  };

// make a singleton services
export const BatchServices = (axios: AxiosInstance) => ({
  getDropdownBatch: getDropdownBatch(axios),
  getBatchDatatable: getBatchDatatable(axios),
  updateStatusBatch: updateStatusBatch(axios),
  createBatch: createBatch(axios),
  updateBatch: updateBatch(axios),
  deleteBatch: deleteBatch(axios),
  exportBatch: exportBatch(axios),
});

// service type
export type BatchServicesType = ReturnType<typeof BatchServices>;
