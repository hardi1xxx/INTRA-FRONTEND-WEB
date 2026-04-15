import { UpsertDailyManPowerRequest } from "@/app/(postlogin)/transaction/daily-man-power/schema";
import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import moment from "moment";

// get dropdown options
const getDropdownDailyManPower =
  (axios: AxiosInstance) =>
  async (
    props: GetDropdownOptionsRequest
  ): Promise<GetDropdownOptionsResponse> => {
    const response = await axios.post(
      "/transaction/daily-man-power/show",
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
const getDailyManPowerDatatable =
  (axios: AxiosInstance) =>
  async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
    const response = await axios.post(
      "/transaction/daily-man-power/show",
      {
        ...props,
      }
    );

    return response.data.result;
  };

// create new data
const createDailyManPower =
  (axios: AxiosInstance) =>
  async (props: UpsertDailyManPowerRequest): Promise<string> => {
    const response = await axios.post(
      `/transaction/daily-man-power/insert`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// import new data
const importDailyManPower =
  (axios: AxiosInstance) =>
  async (props: UpsertDailyManPowerRequest): Promise<string> => {
    const response = await axios.post(
      `/transaction/daily-man-power/import`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// update existing data
const updateDailyManPower =
  (axios: AxiosInstance) =>
  async ({
    id,
    ...props
  }: UpsertDailyManPowerRequest & WithId): Promise<string> => {
    const response = await axios.put(
      `/transaction/daily-man-power/update/${id}`,
      {
        ...props,
      }
    );

    return response.data.message;
  };

// delete data
const deleteDailyManPower =
  (axios: AxiosInstance) =>
  async ({ id }: WithId): Promise<string> => {
    const response = await axios.delete(
      `/transaction/daily-man-power/delete/${id}`
    );

    return response.data.message;
  };

// exporting data to .xlsx
const exportDailyManPower =
  (axios: AxiosInstance) =>
  async (props?: GetDatatableRequest): Promise<Blob> => {
    const response = await axios.post(
      `/transaction/daily-man-power/export`,
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
export const DailyManPowerServices = (axios: AxiosInstance) => ({
  getDropdownDailyManPower: getDropdownDailyManPower(axios),
  getDailyManPowerDatatable: getDailyManPowerDatatable(axios),
  createDailyManPower: createDailyManPower(axios),
  importDailyManPower: importDailyManPower(axios),
  updateDailyManPower: updateDailyManPower(axios),
  deleteDailyManPower: deleteDailyManPower(axios),
  exportDailyManPower: exportDailyManPower(axios),
});

// service type
export type DailyManPowerServicesType = ReturnType<typeof DailyManPowerServices>;
