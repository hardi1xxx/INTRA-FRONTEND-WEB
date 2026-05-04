import { UpsertCategoryProjectRequest } from "@/app/(postlogin)/master/category-project/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getDropdownCategoryProject =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "/master/categoryProject/show",
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
const getCategoryProjectDatatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post(
      "/master/categoryProject/show",
      {
        ...props,
      }
    );

    return response.data.result;
  };

// update status
const updateStatusCategoryProject =
  (axios: AxiosInstance) =>
  async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
    const response = await axios.put(
      `/master/categoryProject/update-status/${id}`,
      {
        status,
      }
    );

    return response.data.message;
  };

// create new data
const createCategoryProject =
  (axios: AxiosInstance) =>
  async (props: UpsertCategoryProjectRequest): Promise<string> => {
    const response = await axios.post(
      `/master/categoryProject/insert`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// update existing data
const updateCategoryProject =
  (axios: AxiosInstance) =>
  async ({
    id,
    ...props
  }: UpsertCategoryProjectRequest & WithId): Promise<string> => {
    const response = await axios.put(
      `/master/categoryProject/update/${id}`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// delete data
const deleteCategoryProject =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.delete(
      `/master/categoryProject/delete/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportCategoryProject =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `/master/categoryProject/excel-download`,
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
      `Master-CategoryProject-export-${moment().format("YYYY-MM-DD")}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    return response.data;
  };

// make a singleton services
export const CategoryProjectServices = (axios: AxiosInstance) => ({
  getDropdownCategoryProject: getDropdownCategoryProject(axios),
  getCategoryProjectDatatable: getCategoryProjectDatatable(axios),
  updateStatusCategoryProject: updateStatusCategoryProject(axios),
  createCategoryProject: createCategoryProject(axios),
  updateCategoryProject: updateCategoryProject(axios),
  deleteCategoryProject: deleteCategoryProject(axios),
  exportCategoryProject: exportCategoryProject(axios),
});

// service type
export type CategoryProjectServicesType = ReturnType<typeof CategoryProjectServices>;
