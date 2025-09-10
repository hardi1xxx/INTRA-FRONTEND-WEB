import {
  DropdownOptions,
  GetDatatableRequest,
  GetDatatableResponse,
} from "@/type/services";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  fetching: boolean;
  fetchingExport: boolean;
  data: Record<string, any>[];
  dataTotal: number;
  params: GetDatatableRequest;

  dropdownOptionsLoading: boolean;
  dropdownOptions: {
    [key: string]: DropdownOptions[];
  };

  error: string | null;
  validationError: Record<string, any>;
};

const initialState: State = {
  fetching: false,
  fetchingExport: false,
  data: [],
  dataTotal: 0,
  params: {
    start: 0,
    length: 10,
    search: "",
  },

  dropdownOptionsLoading: false,
  dropdownOptions: {},

  error: null,
  validationError: {},
};

const jobPosition = createSlice({
  initialState: initialState,
  name: "jobPosition",
  reducers: {
    setParam: (state, action) => {
      const status = action.payload.status == "all" ? undefined : parseInt(action.payload.status);
      action.payload.status = status;
      
      state.params = action.payload;
      return state;
    },
    resetParam: (state) => {
      state.params = {
        ...initialState.params,
        order: state.params.order,
      };
      return state;
    },
    request: (state) => {
      state.fetching = true;
      state.error = null;
      state.validationError = {};

      return state;
    },
    receive: (state, action: PayloadAction<GetDatatableResponse>) => {
      const payload = action.payload;
      state.data = payload.data;
      state.dataTotal = payload.recordsFiltered;
      state.fetching = false;
      state.error = null;

      return state;
    },
    error: (state, action) => {
      state.fetching = false;
      state.fetchingExport = false;
      state.error = action.payload.error;
      state.validationError = action.payload.validationError;

      return state;
    },
    receiveNo: (state) => {
      state.data = initialState.data;
      state.dataTotal = initialState.dataTotal;
      state.fetching = false;

      return state;
    },
    requestExport: (state) => {
      state.fetchingExport = true;
      state.error = null;

      return state;
    },
    receiveExport: (state) => {
      state.fetchingExport = false;
      state.error = null;

      return state;
    },
    requestDropdownOptions: (state) => {
      state.dropdownOptionsLoading = true;
      return state;
    },
    receiveDropdownOptions: (
      state,
      action: PayloadAction<{
        column: string;
        options: DropdownOptions[];
      }>
    ) => {
      state.dropdownOptions[action.payload.column] = action.payload.options;
      state.dropdownOptionsLoading = false;
      return state;
    },
    resetDropdownOptions: (state) => {
      state.dropdownOptions = {};
      return state;
    },
    resetData: (state) => {
      state.data = [];
      return state;
    },
    resetSelectedDropdownOptions: (state, action: PayloadAction<{ column: string }>) => {
      state.dropdownOptions[action.payload.column] = [];
      state.dropdownOptionsLoading = false;
      return state;
    },
  },
});

export const jobPositionActions = jobPosition.actions;

export default jobPosition.reducer;
