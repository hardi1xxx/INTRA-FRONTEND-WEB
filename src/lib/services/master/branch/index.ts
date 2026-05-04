import { UpsertBranchRequest } from "@/app/(postlogin)/master/branch/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getDropdownBranch =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "/master/branch/show",
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
const getBranchDatatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post(
      "/master/branch/show",
      {
        ...props,
      }
    );

    return response.data.result;
  };

// update status
const updateStatusBranch =
  (axios: AxiosInstance) =>
  async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
    const response = await axios.put(
      `/master/branch/update-status/${id}`,
      {
        status,
      }
    );

    return response.data.message;
  };

// create new data
const createBranch =
  (axios: AxiosInstance) =>
  async (props: UpsertBranchRequest): Promise<string> => {
    const response = await axios.post(
      `/master/branch/insert`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// update existing data
const updateBranch =
  (axios: AxiosInstance) =>
  async ({
    id,
    ...props
  }: UpsertBranchRequest & WithId): Promise<string> => {
    const response = await axios.put(
      `/master/branch/update/${id}`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// delete data
const deleteBranch =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.delete(
      `/master/branch/delete/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportBranch =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `/master/branch/excel-download`,
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
      `Master-Branch-export-${moment().format("YYYY-MM-DD")}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    return response.data;
  };

// make a singleton services
export const BranchServices = (axios: AxiosInstance) => ({
  getDropdownBranch: getDropdownBranch(axios),
  getBranchDatatable: getBranchDatatable(axios),
  updateStatusBranch: updateStatusBranch(axios),
  createBranch: createBranch(axios),
  updateBranch: updateBranch(axios),
  deleteBranch: deleteBranch(axios),
  exportBranch: exportBranch(axios),
});

// service type
export type BranchServicesType = ReturnType<typeof BranchServices>;
