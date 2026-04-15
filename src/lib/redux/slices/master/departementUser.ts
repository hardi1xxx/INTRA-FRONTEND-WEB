import { parseStatus } from "@/lib/services/parseStatus";
import { DropdownOptions, GetDatatableRequest, GetDatatableResponse } from "@/type/services";
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
  resetTable: boolean;
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
  resetTable: true,
};

const departementUser = createSlice({
  initialState: initialState,
  name: "departementUser",
  reducers: {
    /**
     * set params for hierarki filter
     */
    setParams: (state, action) => {
      action.payload.status = parseStatus(action.payload.status);

      state.params = action.payload;
      return state;
    },

    /**
     * reset hierarki filter except order, start, and length
     */
    resetParam: (state) => {
      state.params = {
        ...initialState.params,
        order: state.params.order,
        start: state.params.start,
        length: state.params.length,
      };
      return state;
    },

    /**
     * request data from server
     */
    request: (state) => {
      state.fetching = true;
      state.error = null;
      return state;
    },

    /**
     * receive data from server
     */
    receive: (state, action: PayloadAction<GetDatatableResponse>) => {
      const payload = action.payload;
      state.data = payload.data;
      state.dataTotal = payload.recordsFiltered;
      state.fetching = false;
      state.error = null;
      state.resetTable = false;

      return state;
    },

    /**
     * set loading state to false & set error
     */
    error: (state, action) => {
      state.fetching = false;
      state.dropdownOptionsLoading = false;
      state.fetchingExport = false;
      state.error = action.payload;

      return state;
    },

    /**
     * reset data into initial state & set loading state to false
     */
    receiveNo: (state) => {
      state.data = initialState.data;
      state.fetching = false;
      state.resetTable = true;
      state.dataTotal = 0

      return state;
    },

    /**
     * request for feature export
     */
    requestExport: (state) => {
      state.fetchingExport = true;
      state.error = null;

      return state;
    },

    /**
     * done for feature export
     */
    receiveExport: (state) => {
      state.fetchingExport = false;
      state.error = null;

      return state;
    },
    /**
     * set loading state for dropdown
     */
    requestDropdownOptions: (state) => {
      state.dropdownOptionsLoading = true;
      return state;
    },

    /**
     * receive dropdown options to state
     */
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

    /**
     * reset dropdown options
     */
    resetDropdownOptions: (state) => {
      state.dropdownOptions = {};
      return state;
    },
  },
});

export const departementUserActions = departementUser.actions;

export default departementUser.reducer;
