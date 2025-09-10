import { UpsertJobPositionRequest } from "@/app/(postlogin)/setting/job-position/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getDropdownJobPosition =
  (axios: AxiosInstance) =>
  async (props: GetDropdownOptionsRequest): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post("/master/job-position/filter-data-job-position", {
      type: "dropdown",
      ...props,
    });

    const options = (response.data.result as Record<string, any>[]).map((item) => ({
      value: item[props.column],
      label: item[props.column],
    }));

    return options;
  };

// get data table
const getJobPositionDatatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post("/master/job-position/filter-data-job-position", {
      ...props,
    });

    return response.data.result;
  };

// create new data
const createJobPosition =
  (axios: AxiosInstance) =>
  async (props: UpsertJobPositionRequest): Promise<string> => {
    const response = await axios.post(`/master/job-position/insert-data-job-position`, {
      ...props,
    });

    return response.data.message;
  };

// update existing data
const updateJobPosition =
  (axios: AxiosInstance) =>
  async ({ id, ...props }: UpsertJobPositionRequest & WithId): Promise<string> => {
    const response = await axios.put(`/master/job-position/update-data-job-position/${id}`, {
      ...props,
    });

    return response.data.message;
  };

// update status
const updateStatusJobPosition =
  (axios: AxiosInstance) =>
  async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
    const response = await axios.put(`/master/job-position/update-status-data-job-position/${id}`, {
      status,
    });

    return response.data.message;
  };

// delete data
const deleteJobPosition =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.delete(`/master/job-position/delete-data-job-position/${id}`);

    return response.data.message;
  };

// exporting data to .xlsx
const exportJobPosition =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `/master/job-position/excel-download-data-job-position`,
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
    link.setAttribute("download", `Setting-Job-Position-export-${moment().format("YYYY-MM-DD")}.xlsx`);
    document.body.appendChild(link);
    link.click();

    return response.data;
  };

// make a singleton services
export const JobPositionServices = (axios: AxiosInstance) => ({
  getDropdownJobPosition: getDropdownJobPosition(axios),
  getJobPositionDatatable: getJobPositionDatatable(axios),
  createJobPosition: createJobPosition(axios),
  updateJobPosition: updateJobPosition(axios),
  updateStatusJobPosition: updateStatusJobPosition(axios),
  deleteJobPosition: deleteJobPosition(axios),
  exportJobPosition: exportJobPosition(axios),
});

// service type
export type JobPositionServicesType = ReturnType<typeof JobPositionServices>;
