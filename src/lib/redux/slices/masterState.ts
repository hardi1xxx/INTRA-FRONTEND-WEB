import { parseStatus } from "@/lib/services/parseStatus";
import { DropdownOptions, GetDatatableRequest, GetDatatableResponse } from "@/type/services";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type DataId = {
  id: string;
};

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

  idData: DataId[];
  fetchingIdData: boolean;

  error: string | null;
  resetTable: boolean;
  isFiltered?: boolean;
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

  idData: [],
  fetchingIdData: false,

  error: null,
  resetTable: true,
  isFiltered: false,
};

export const generateMasterSlice = (name: string) => {
  return createSlice({
    initialState: initialState,
    name: name,
    reducers: {
      /**
       * set params for hierarki filter
       */
      setParams: (state, action: PayloadAction<GetDatatableRequest>) => {
        action.payload.status = parseStatus(action.payload.status);
        state.resetTable = false;

        state.params = action.payload;
        return state;
      },

      setIsFiltered: (state, action: PayloadAction<boolean>) => {
        state.isFiltered = action.payload;
        return state;
      },

      /**
       * reset hierarki filter except order, start, and length
       */
      resetParam: (state) => {
        state.params = {
          ...initialState.params,
          // order: state.params.order,
          // start: state.params.start,
          // length: state.params.length,
        };
        state.resetTable = true;
        return state;
      },
      /**
       * reset hierarki filter except order, start, and length but with some value
       */
      resetParamWithValue: (state, action: PayloadAction<Partial<State["params"]>>) => {
        state.params = {
          ...initialState.params,
          ...action.payload,
        };
        state.resetTable = true;
        return state;
      },

      /**
       * reset hierarki filter except order
       */
      clearParams: (state) => {
        state.params = {
          ...initialState.params,
          order: state.params.order,
        };
        state.resetTable = true;
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
        state.dataTotal = payload.recordsTotal;
        state.fetching = false;
        state.error = null;

        return state;
      },

      /**
       * set loading state to false & set error
       */
      error: (state, action) => {
        state.fetching = false;
        state.dropdownOptionsLoading = false;
        state.dropdownOptions = {};
        state.fetchingExport = false;
        state.error = action.payload;

        return state;
      },

      /**
       * reset data into initial state & set loading state to false
       */
      receiveNo: (state) => {
        state.data = initialState.data;
        state.dataTotal = initialState.dataTotal;
        state.fetching = false;

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
        }>,
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

      /**
       * reset selected dropdown options
       */
      resetSelectedDropdownOptions: (
        state,
        action: PayloadAction<{
          column: string;
        }>,
      ) => {
        state.dropdownOptions[action.payload.column] = [];
        state.dropdownOptionsLoading = false;
        return state;
      },

      requestIdDataDropdown: (state) => {
        state.fetchingIdData = true;
        state.fetching = false;
        state.error = null;

        return state;
      },

      receiveIdDataDropdown: (state, { payload }) => {
        state.fetchingIdData = false;
        state.idData = payload;

        return state;
      },
    },
  });
};
