import { DataUser, FilterParamsUser } from "@/lib/redux/slices/master/user";
import { AxiosInstance } from "axios";
import { DefaultServiceResponse } from "../..";

export type DataUserRequestType = {
  name: string;
  nik: string;
  role_id: string;
  // departement_user_id: string | null;
  picture?: File | null;
  is_web: string;
  is_app: string;
  email: string;
  phone_number: string;
  picture_sign?: File | null;
  // job_position_id: string | null;
};

// service for get user by id
export const getUserByIDService =
  (axios: AxiosInstance) =>
    async (id: number): Promise<DefaultServiceResponse & { result: DataUser }> => {
      try {
        const response = await axios.get(`/master/user/show-data-id-user/${id}`);

        return response.data;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };
// service for get user by nik
export const getUserByNikService =
  (axios: AxiosInstance) =>
    async (nik: string): Promise<DefaultServiceResponse & { result: DataUser }> => {
      try {
        const response = await axios.get(`/master/user/show-data-nik-user/${nik}`);

        return response.data;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

// service for get data in main table
export const getUserFilterDataService =
  (axios: AxiosInstance) =>
    async (params: FilterParamsUser): Promise<DefaultServiceResponse & { result: { data: DataUser[]; recordsTotal: number; recordsFiltered: number } }> => {
      try {
        const response = await axios.post("/master/user/filter-data-user", {
          ...params,
          type: "table",
        });

        return response.data;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

// service for get data dropdown
export const getUserDropdownDataService =
  (axios: AxiosInstance) =>
    async (params: FilterParamsUser): Promise<DefaultServiceResponse & { result: { data: any[] } }> => {
      try {
        const response = await axios.post("/master/user/filter-data-user", {
          ...params,
          type: "dropdown",
        });

        return response.data;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

export const createUserService =
  (axios: AxiosInstance) =>
    async (data: DataUserRequestType): Promise<DefaultServiceResponse & { data: DataUser[] }> => {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("nik", data.nik);
        formData.append("role_id", data.role_id);
        // formData.append("departement_user_id", data.departement_user_id);
        formData.append("is_web", data.is_web);
        formData.append("is_app", data.is_app);
        formData.append("email", data.email);
        formData.append("phone_number", data.phone_number);
        // formData.append("job_position_id", data.job_position_id);
        if (data.picture) {
          formData.append("picture", data.picture);
        }
        if (data.picture_sign) {
          formData.append("picture_sign", data.picture_sign);
        }

        const response = await axios.post("/master/user/insert-data-user", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

export const updateUserService =
  (axios: AxiosInstance) =>
    async (id: number, data: DataUserRequestType): Promise<DefaultServiceResponse & { data: DataUser[] }> => {
      try {
        const formData = new FormData();
        formData.append("id", id.toString());
        formData.append("name", data.name);
        formData.append("nik", data.nik);
        formData.append("_method", "PUT");
        formData.append("role_id", data.role_id);
        // formData.append("departement_user_id", data.departement_user_id);
        formData.append("is_web", data.is_web);
        formData.append("is_app", data.is_app);
        formData.append("email", data.email);
        if(data.phone_number) {
          formData.append("phone_number", data.phone_number);
        }
        // formData.append("job_position_id", data.job_position_id);
        if (data.picture) {
          formData.append("picture", data.picture);
        }
        if (data.picture_sign) {
          formData.append("picture_sign", data.picture_sign);
        }

        const response = await axios.post(`/master/user/update-data-user/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

export const deleteUserService =
  (axios: AxiosInstance) =>
    async (id: number): Promise<DefaultServiceResponse & { data: DataUser[] }> => {
      try {
        const response = await axios.delete(`/master/user/delete-data-user/${id}`);
        return response.data;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

export const exportUserService =
  (axios: AxiosInstance) =>
    async (params: FilterParamsUser): Promise<Blob> => {
      try {
        const response = await axios.post(
          "/master/user/excel-download-data-user",
          {
            type: "table",
            filter_param: params.filter_param ?? "",
            order_param: params.order_param ?? "",
            search: params.search ?? "",
          },
          {
            responseType: "blob",
          }
        );

        return response.data;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

export const resetPasswordService =
  (axios: AxiosInstance) =>
    async (id: number): Promise<DefaultServiceResponse> => {
      try {
        const response = await axios.post("/master/user/reset-password", { id });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response.data.message, {
          cause: error,
        });
      }
    };

export const getUserDepartementDropdownService = (axios: AxiosInstance) => async (keyword: string): Promise<DefaultServiceResponse & { result: { data: { id: number; departement: string, }[] } }> => {
  try {
    const response = await axios.post('/master/departement-user/filter-data', {
      "type": "table",
      "search": keyword,
      "order_param": "departement,asc",
      "filter_param": "status,1"
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message, {
      cause: error,
    });
  }
}

export const getUserJobPositionsDropdownService = (axios: AxiosInstance) => async (keyword: string): Promise<DefaultServiceResponse & { result: { data: { id: number; job_position: string, }[] } }> => {
  try {
    const response = await axios.post('/master/job-position/filter-data-job-position', {
      "type": "table",
      "search": keyword,
      "order": "job_position,asc",
      "status": 1,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message, {
      cause: error,
    });
  }
}

export const getUserRoleDropdownService = (axios: AxiosInstance) => async (keyword: string): Promise<DefaultServiceResponse & { result: { data: { id: number; role: string, }[] } }> => {
  try {
    const response = await axios.post('/master/role/filter-data-role', {
      "type": "table",
      "search": keyword,
      "order": "role,asc"
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message, {
      cause: error,
    });
  }
}

export type UserServiceType = {
  getUserFilterData: (params: FilterParamsUser) => Promise<DefaultServiceResponse & { result: { data: DataUser[]; recordsTotal: number; recordsFiltered: number } }>;
  getUserDropdownData: (params: FilterParamsUser) => Promise<DefaultServiceResponse & { result: { data: any[] } }>;
  createUser: (data: DataUserRequestType) => Promise<DefaultServiceResponse & { data: DataUser[] }>;
  updateUser: (id: number, data: DataUserRequestType) => Promise<DefaultServiceResponse & { data: DataUser[] }>;
  deleteUser: (id: number) => Promise<DefaultServiceResponse & { data: DataUser[] }>;
  exportUser: (params: FilterParamsUser) => Promise<Blob>;
  resetPassword: (id: number) => Promise<DefaultServiceResponse>;
  getUserByID: (id: number) => Promise<DefaultServiceResponse & { result: DataUser }>;
  getUserByNik: (nik: string) => Promise<DefaultServiceResponse & { result: DataUser }>;
  getUserDepartementDropdown: (keyword: string) => Promise<DefaultServiceResponse & { result: { data: { id: number; departement: string, }[] } }>;
  getUserJobPositionsDropdown: (keyword: string) => Promise<DefaultServiceResponse & { result: { data: { id: number; job_position: string, }[] } }>;
  getUserRoleDropdown: (keyword: string) => Promise<DefaultServiceResponse & { result: { data: { id: number; role: string, }[] } }>;
};

export const UserServices = (axiosInstanceWithToken: AxiosInstance): UserServiceType => ({
  getUserFilterData: getUserFilterDataService(axiosInstanceWithToken),
  getUserDropdownData: getUserDropdownDataService(axiosInstanceWithToken),
  createUser: createUserService(axiosInstanceWithToken),
  updateUser: updateUserService(axiosInstanceWithToken),
  deleteUser: deleteUserService(axiosInstanceWithToken),
  exportUser: exportUserService(axiosInstanceWithToken),
  resetPassword: resetPasswordService(axiosInstanceWithToken),
  getUserByID: getUserByIDService(axiosInstanceWithToken),
  getUserByNik: getUserByNikService(axiosInstanceWithToken),
  getUserDepartementDropdown: getUserDepartementDropdownService(axiosInstanceWithToken),
  getUserJobPositionsDropdown: getUserJobPositionsDropdownService(axiosInstanceWithToken),
  getUserRoleDropdown: getUserRoleDropdownService(axiosInstanceWithToken),
});
