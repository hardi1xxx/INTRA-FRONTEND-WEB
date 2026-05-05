import { UpsertBranchRequest } from "@/app/(postlogin)/master/branch/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, GetFilterOptionsRequest, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getFilterBranch =
  (axios: AxiosInstance) =>
  async (
    props: GetFilterOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "v1/master/branch/filter",
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

const getDropdownBranch =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "v1/master/branch/dropdown",
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
const getBranchDatatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post(
      "v1/master/branch/show",
      {
        ...props,
      }
    );

    return response.data.data;
  };

// get data table
const getBranchByID =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.get(
      `v1/master/branch/detail/${id}`
    );

    return response.data;
  };

// update status
const updateStatusBranch =
  (axios: AxiosInstance) =>
  async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
    const response = await axios.put(
      `v1/master/branch/update-status/${id}`,
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
      `v1/master/branch/create`,
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
      `v1/master/branch/update/${id}`,
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
      `v1/master/branch/delete/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportBranch =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `v1/master/branch/export`,
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
  getFilterBranch: getFilterBranch(axios),
  getBranchDatatable: getBranchDatatable(axios),
  getBranchByID: getBranchByID(axios),
  updateStatusBranch: updateStatusBranch(axios),
  createBranch: createBranch(axios),
  updateBranch: updateBranch(axios),
  deleteBranch: deleteBranch(axios),
  exportBranch: exportBranch(axios),
});

// service type
export type BranchServicesType = ReturnType<typeof BranchServices>;
