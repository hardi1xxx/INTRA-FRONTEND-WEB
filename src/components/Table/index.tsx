"use client";
import * as React from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { Box, Grid, MenuItem, Pagination, Select, styled, TextField, Typography } from "@mui/material";
import { AllCommunityModule, ColDef, GridReadyEvent, ModuleRegistry, themeQuartz } from "ag-grid-community";

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

type TableContext<T extends unknown = Record<string, any>> = {
  data?: T[];
  isLoading?: boolean;
  currentPage: number;
  totalPage: number;
  totalData: number;
  pageSize: number;
  globalSearch: string;
  sort?: {
    order: "asc" | "desc";
    column: string;
  }[];
  __setCurrentPage: (currentPage: number) => void;
  __setPageSize: (currentPage: number) => void;
  __setGlobalSearch: (search: string) => void;
  __setSort: (sort: { order: "asc" | "desc"; column: string }[]) => void;
};

const Context = React.createContext<TableContext | null>(null);

export function useTable() {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useTable must be used within a <Table />");
  }

  return context;
}

type Props<TData extends unknown = Record<string, any>> = React.PropsWithChildren<{
  globalSearch?: string;
  onGlobalSearchChange?: (search: string) => void;

  page?: number;
  onPageChange?: (page: number) => void;

  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;

  totalData?: number;

  data?: TData[];
  isLoading?: boolean;

  sort?: {
    order: "asc" | "desc";
    column: string;
  }[];
  onSortChange?: (sort: { order: "asc" | "desc"; column: string }[]) => void;
}>;

export function Table({ children, ...props }: Props) {
  const [currentPage, __setCurrentPage] = React.useState(1);
  const [pageSize, __setPageSize] = React.useState(10);
  const [globalSearch, __setGlobalSearch] = React.useState("");

  return (
    <Context.Provider
      value={{
        data: props.data,
        isLoading: props.isLoading,
        currentPage: props.page ?? currentPage,
        totalPage: props.totalData ? Math.ceil(props.totalData / (props.pageSize ?? pageSize)) : 0,
        totalData: props.totalData ?? 0,
        pageSize: props.pageSize ?? pageSize,
        globalSearch: props.globalSearch ?? globalSearch,
        sort: props.sort,
        __setCurrentPage: props.onPageChange ?? __setCurrentPage,
        __setPageSize: props.onPageSizeChange ?? __setPageSize,
        __setGlobalSearch: props.onGlobalSearchChange ?? __setGlobalSearch,
        __setSort: props.onSortChange ?? (() => {}),
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const TableAggrid = React.forwardRef<React.ElementRef<typeof AgGridReact>, Omit<React.ComponentPropsWithoutRef<typeof AgGridReact>, "rowData" | "loading">>((props, ref) => {
  const table = useTable();

  return (
    <div
      style={{
        height: "490px",
      }}
    >
      <AgGridReact
        {...props}
        theme={themeQuartz}
        rowData={table.data}
        loading={table.isLoading}
        defaultColDef={{
          comparator: () => 0,
          cellStyle: { userSelect: "text" },
        }}
        onSortChanged={(e) => {
          if (e.columns?.length) {
            const column = e.columns[e.columns.length - 1];
            const sort = column.getSort();
            if (sort) {
              return table.__setSort([{ column: column.getColId(), order: sort }]);
            }
            return table.__setSort([]);
          }
        }}
        ref={ref}
        className="ag-theme-quartz"
        paginationPageSizeSelector={[10, 50, 100]}
        paginationPageSize={table.pageSize}
        overlayLoadingTemplate={
          '<div aria-live="polite" aria-atomic="true" style="position:absolute;top:0;left:0;right:0; bottom:0; background: url(https://ag-grid.com/images/ag-grid-loading-spinner.svg) center no-repeat" aria-label="loading"></div>'
        }
        overlayNoRowsTemplate={'<span aria-live="polite" aria-atomic="true" style="padding: 10px;">No Data Found</span>'}
      />
    </div>
  );
});

TableAggrid.displayName = "TableAggrid";

export function TablePagination() {
  const table = useTable();
  return (
    <Grid container spacing={"1rem"}>
      <Grid item xs={12} md={5}>
        <Grid container display="flex" alignItems="center" spacing={"1rem"}>
          <Grid item xs={12} display="flex" justifyContent={{ xs: "center", md: "start" }} alignItems="center">
            <Box>
              <Box
                sx={{
                  display: "inline-block",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
              >
                <Typography
                  sx={{
                    display: "inline-block",
                    marginRight: "10px",
                  }}
                >
                  Rows
                </Typography>
                <Select
                  variant="outlined"
                  value={table.pageSize}
                  size="small"
                  onChange={(size) => {
                    table.__setPageSize(Number(size.target.value));
                  }}
                >
                  {[10, 50, 100].map((item: number) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Typography
                sx={{
                  display: "inline-block",
                  paddingLeft: "10px",
                }}
              >
                Total Data: {table.totalData}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={7}>
        <Box display={"flex"} justifyContent={{ xs: "center", md: "end" }} width={"100%"} gap={"1rem"}>
          <StyledPagination
            page={table.currentPage}
            onChange={(_, page) => {
              table.__setCurrentPage(Number(page));
            }}
            count={table.totalPage}
            color="primary"
            shape="rounded"
          />
        </Box>
      </Grid>
    </Grid>
  );
}
const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    [theme.breakpoints.down("md")]: {
      height: "1.8rem",
      width: "1.8rem",
    },
  },
}));

export function TableGlobalSearch() {
  const table = useTable();
  const [temp, setTemp] = React.useState("");

  React.useEffect(() => {
    if (temp == table.globalSearch) return;
    setTemp(table.globalSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.globalSearch]);

  return (
    <Box>
      <TextField
        variant="outlined"
        placeholder="Search..."
        size="small"
        onChange={(e) => {
          setTemp(e.target.value);
          table.__setGlobalSearch(e.target.value);
        }}
        value={temp}
      />
    </Box>
  );
}
