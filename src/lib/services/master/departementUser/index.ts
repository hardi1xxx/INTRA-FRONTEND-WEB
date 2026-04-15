import { GetDatatableRequest, GetDatatableResponse, GetDropdownOptionsRequest, GetDropdownOptionsResponse, WithId } from "@/type/services";
import { AxiosInstance } from "axios";
import * as yup from "yup";
import moment from "moment";

export const upsertDepartementUserSchema = yup.object().shape({
  status: yup.number(),
  departement: yup.string().required("Please Input Field (Department)"),
});

export type UpsertDepartementUserRequest = yup.InferType<typeof upsertDepartementUserSchema>;

const filterParams = ['status', 'departement']

// function for parsing get order param
const getOrderParam = (order: string) => {
  let orderParam = ''
  if (order != '') {
    for (const splitted of order.split('|')) {
      const split = splitted.split(',')
      if (split[1] != 'null' && split[1] != 'undefined') {
        orderParam += `${split[0]},${split[1]}`
      }
    }
  }
  return orderParam
}

// get dropdown options
const getDropdownDepartementUser =
  (axios: AxiosInstance) =>
    async (props: GetDropdownOptionsRequest): Promise<GetDropdownOptionsResponse> => {
      try {
        const filter_param = Object.entries(props).filter(([key, value]) => filterParams.includes(key) && value != undefined && value != '').map(([key, value]) => `${key},${value ?? ''}`).join('|')
        const response = await axios.post("/master/departement-user/filter-data", {
          type: "dropdown",
          order_param: `${props.column},asc`,
          filter_param,
          ...props,
        });

        const options = (response.data.result.data as Record<string, any>[]).map((item) => ({
          value: item[props.column],
          label: item[props.column],
        }));

        return options;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

// get data table
const getDepartementUserDatatable =
  (axios: AxiosInstance) =>
    async (props: GetDatatableRequest): Promise<GetDatatableResponse> => {
      try {
        const filter_param = Object.entries(props).filter(([key, value]) => filterParams.includes(key) && value != undefined && value != '').map(([key, value]) => `${key},${value ?? ''}`).join('|')
        const response = await axios.post("/master/departement-user/filter-data", {
          type: "table",
          order_param: getOrderParam(props['order'] ?? ''),
          filter_param,
          ...props,
        });

        return response.data.result;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

// update status
const updateStatusDepartementUser =
  (axios: AxiosInstance) =>
    async ({ id, status }: WithId & { status: 0 | 1 }): Promise<string> => {
      try {
        const response = await axios.put(`/master/departement-user/update-status/${id}`, {
          status,
        });

        return response.data.message;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

// create new data
const createDepartementUser =
  (axios: AxiosInstance) =>
    async (props: UpsertDepartementUserRequest): Promise<string> => {
      try {
        const response = await axios.post(`/master/departement-user/insert-data`, {
          ...props,
        });

        return response.data.message;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

// update existing data
const updateDepartementUser =
  (axios: AxiosInstance) =>
    async ({ id, ...props }: UpsertDepartementUserRequest & WithId): Promise<string> => {
      try {
        const response = await axios.put(`/master/departement-user/update-data/${id}`, {
          ...props,
        });

        return response.data.message;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

// delete data
const deleteDepartementUser =
  (axios: AxiosInstance) =>
    async ({ id }: WithId): Promise<string> => {
      try {
        const response = await axios.delete(`/master/departement-user/delete-data/${id}`);

        return response.data.message;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

// exporting data to .xlsx
const exportDepartementUser =
  (axios: AxiosInstance) =>
    async (props?: GetDatatableRequest): Promise<Blob> => {
      try {
        const filter_param = Object.entries(props!).filter(([key, value]) => filterParams.includes(key) && value != undefined && value != '').map(([key, value]) => `${key},${value ?? ''}`).join('|')
        const response = await axios.post(
          `/master/departement-user/excel-download-data`,
          {
            type: "table",
            order_param: getOrderParam(props!['order'] ?? ''),
            filter_param,
            ...props,
          },
          {
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Setting-Department-User-export-${moment().format("YYYY-MM-DD")}.xlsx`);
        document.body.appendChild(link);
        link.click();

        return response.data;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

// make a singleton services
export const DepartementUserServices = (axios: AxiosInstance) => ({
  getDropdownDepartementUser: getDropdownDepartementUser(axios),
  getDepartementUserDatatable: getDepartementUserDatatable(axios),
  updateStatusDepartementUser: updateStatusDepartementUser(axios),
  createDepartementUser: createDepartementUser(axios),
  updateDepartementUser: updateDepartementUser(axios),
  deleteDepartementUser: deleteDepartementUser(axios),
  exportDepartementUser: exportDepartementUser(axios),
});

// service type
export type DepartementUserServicesType = ReturnType<typeof DepartementUserServices>;
