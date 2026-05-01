/* eslint-disable react-hooks/exhaustive-deps */
// ag grid
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { Box, Grid, MenuItem, Pagination as MuiPagination, styled, Select, SelectChangeEvent, TextField, InputAdornment, Typography, useMediaQuery, useTheme, ButtonPropsVariantOverrides, ButtonPropsColorOverrides, ButtonPropsSizeOverrides, SxProps, Theme, Divider } from "@mui/material";
import { AllCommunityModule, ColDef, ModuleRegistry, SortChangedEvent, themeQuartz } from "ag-grid-community";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import ActionButtonResponsive, { ActionButtonResponseType } from "../ActionButtonResponsive";
import { OverridableStringUnion } from "@mui/types";
import colors from '@/assets/scss/_themes-vars.module.scss';
import { IconSearch } from "@tabler/icons-react";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";


// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

export const StyledPagination = styled(MuiPagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    [theme.breakpoints.down("md")]: {
      height: "1.8rem",
      width: "1.8rem",
    },
  },
  '& .MuiPaginationItem-icon': {
    fill: colors.primaryMain
  },
  '& .MuiButtonBase-root.Mui-disabled .MuiPaginationItem-icon': {
    fill: '#747272'
  },
  '& .MuiPagination-ul li .MuiButtonBase-root': {
    borderRadius: '100%'
  },
  '& .MuiPagination-ul .Mui-selected': {
    background: colors.primary100,
    color: `#fff !important`,
    '&:hover': {
      background: colors.primary100,
      color: `${colors.primaryMain} !important`,
    }
  },
  '& .MuiButtonBase-root': {
    color: '#747272 !important'
  }
}));

export type CustomAGGridProps = {
  serverSideMode?: boolean;
  gridRef: React.RefObject<AgGridReact<any>>;
  onServerSidePropsChange?: ({ start, length, order, search }: { start: number; length: number; order: string; search: string }) => void;
  showTotalData?: boolean;
  totalData: number;
  isLoading: boolean;
  showSearchInput?: boolean;
  usePagination?: boolean;
  height?: string;
  minHeight?: string;
  resetSearch?: boolean;
  resetPage?: boolean;
  cardTitle?: string,
  customToolbarContent?: React.ReactNode;
  customPadding?: string,
  initialSearch?: string,
  suppressAutoSizeColumns?: boolean,
  actionButton?: {
    id?: string,
    text: string | null,
    onClick: () => void
    variant?: OverridableStringUnion<'text' | 'outlined' | 'contained', ButtonPropsVariantOverrides>
    color?: OverridableStringUnion<'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning', ButtonPropsColorOverrides>;
    type?: "submit" | "reset" | "button" | undefined
    size?: OverridableStringUnion<'small' | 'medium' | 'large', ButtonPropsSizeOverrides>
    sx?: SxProps<Theme>
    disabled?: boolean
    endIcon?: ReactNode
    startIcon?: ReactNode
  }[],
};

const AGGrid = ({ ...props }: AgGridReactProps & CustomAGGridProps) => {
  const dispatch = useDispatch();

  const [length, setLength] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [paginationTotalPage, setPaginationTotalPage] = useState<number | null>(null);
  const [totalData, setTotalData] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [inputSearch, setInputSearch] = useState<string>("");
  const [order, setOrder] = useState<string | undefined>("");
  const [isReadyGrid, setIsReadyGrid] = useState<boolean>(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const onChangePageSize = (event: SelectChangeEvent<number>) => {
    const selectedValue = event.target.value as number;
    setLength(selectedValue);
    setPage(1);
    // If -1 (All), set paginationPageSize to totalData or a large number
    if (selectedValue === -1) {
      const totalData = props.totalData ?? 0;
      props.gridRef.current!.api.setGridOption("paginationPageSize", totalData > 0 ? totalData : 10000);
    } else {
      props.gridRef.current!.api.setGridOption("paginationPageSize", selectedValue);
    }
  };

  const onChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    props.gridRef.current!.api.paginationGoToPage(value - 1);
  };

  const onChangeSearch = useDebouncedCallback((value: string) => {

    if (!props.serverSideMode) {
      props.gridRef.current!.api.setGridOption("quickFilterText", value);
      setPaginationTotalPage(props.gridRef.current!.api.paginationGetTotalPages());

      const countFilteredRows = props.gridRef.current!.api.getDisplayedRowCount();
      setTotalData(countFilteredRows);
      if (countFilteredRows <= 0) {
        dispatch(setTextNotification({ text: "No Data Found", severity: "error", }))
      }
    }
    setPage(1);
    props.gridRef.current!.api.paginationGoToPage(0);
    setSearch(value);
  }, 1000);

  useEffect(() => {
    if (props.initialSearch) {
      setInputSearch(props.initialSearch);
      onChangeSearch(props.initialSearch)
    }
  }, [props.initialSearch])

  const onSortChanged = (event: SortChangedEvent) => {
    setOrder(
      props.gridRef.current?.api
        .getColumnState()
        .filter((item) => item.sort != null)
        .map((value) => `${value.colId},${value.sort}`)
        .join("|")
    );
  };

  useEffect(() => {
    const currentLength = length ?? props.paginationPageSize ?? 10;
    const params = {
      start: currentLength === -1 ? 0 : (page - 1) * currentLength,
      length: currentLength === -1 ? -1 : currentLength,
      search: search,
      order: order ?? "",
    };

    if (props.serverSideMode && props.onServerSidePropsChange) {
      props.onServerSidePropsChange(params);
    }
  }, [length, page, search, order]);

  useEffect(() => {
    const currentLength = length ?? props.paginationPageSize ?? 10;
    // If -1 (All), only 1 page
    const totalPages = currentLength === -1 ? 1 : Math.ceil((props.totalData ?? 0) / currentLength);
    setPaginationTotalPage(totalPages);
    setTotalData(props.totalData ?? 0);

    if (page > totalPages) {
      setPage(1);
    }
  }, [props.totalData, length, props.paginationPageSize]);

  useEffect(() => {
    if (isReadyGrid) {
      if (props.isLoading) {
        props.gridRef.current?.api.showLoadingOverlay();
      } else {
        if (props.rowData && props.rowData!.length > 0) {
          props.gridRef.current?.api.hideOverlay();
        } else {
          props.gridRef.current?.api.showNoRowsOverlay();
        }
      }
      setOrder(
        props.gridRef.current?.api
          .getColumnState()
          .filter((item) => item.sort != null)
          .map((value) => `${value.colId},${value.sort}`)
          .join("|")
      );
    }
  }, [isReadyGrid, props.isLoading]);

  const defaultColDef: ColDef = {
    width: 100,
    minWidth: 100,
    sortable: true,
    resizable: true,
    comparator: props.serverSideMode ? (valueA: any, valueB: any) => 0 : undefined,
    headerClass: 'default-global-header'
  };

  useEffect(() => {
    if (props.resetSearch === true) {
      setInputSearch("");
      setSearch("");
      props.gridRef.current?.api?.setGridOption?.("quickFilterText", "");
      setOrder("");
      props.gridRef.current?.api?.applyColumnState({ defaultState: { sort: null } });
      setLength(10);
      setPage(1);
    }
  }, [props.resetSearch]);
  useEffect(() => {
    if (props.resetSearch && isReadyGrid) {
      setInputSearch("");
      setSearch("");

      props.gridRef.current?.api.setGridOption(
        "quickFilterText",
        ""
      );

      props.gridRef.current?.api.onFilterChanged();

      props.gridRef.current?.api.applyColumnState({
        defaultState: { sort: null },
      });

      setLength(10);
      setPage(1);
      props.gridRef.current?.api.paginationGoToPage(0);
    }
  }, [props.resetSearch, isReadyGrid]);

  useEffect(() => {
    if (isReadyGrid && props.resetPage === true) {
      if (props.isLoading) {
        props.gridRef.current?.api.showLoadingOverlay();
      } else {
        props.gridRef.current!.api.paginationGoToPage(0);
        setPage(1);
      }
    }
  }, [props.resetPage, isReadyGrid, props.isLoading]);

  useEffect(() => {
    if (props.totalData == 0) setPage(1);
  }, [props.totalData]);
  const noRowsOverlay = `
    <div style="
      height:100%;
      display:flex;
      flex-direction:column;
      justify-content:end;
      align-items:center;
      margin-top: -20px;
    ">
      <div style="margin-bottom: 30px">
        <img src="/images/Match-not-found.png" alt="No data found" width="40" style="opacity:0.9;" />
        <div style="font-weight:600; font-size:10px; margin-top:4px;">No Data Yet</div>
        <div style="color:#7C878E; font-size:9px;">Try adding new entries</div>
      </div>
    </div>
  `;

  const myTheme = themeQuartz.withParams({
    columnBorder: { style: 'solid' },
  });

  const isEmpty = !props.rowData || props.rowData.length === 0;

  // const isOpenDrawer = useSelector((state: RootState) => state.customization.isOpenDrawer);

  // useEffect(() => {
  //   if (props.suppressAutoSizeColumns || !props.gridRef || (props.rowData ?? []).length === 0) return;
  //   const runAutoSize = () => {
  //     const api = props.gridRef.current?.api;
  //     if (!api) return;
  //     const cols = api.getColumns() ?? [];
  //     const columnIds = cols
  //       .map((col) => {
  //         const colId = col.getColId();
  //         const flex = col.getColDef().flex;
  //         return { colId, flex };
  //       })
  //       .filter(({ colId }) => Boolean(colId))
  //       .filter(({ flex }) => flex !== 1)
  //       .map(({ colId }) => colId as string);
  //     if (columnIds.length) {
  //       api.autoSizeColumns(columnIds, false);
  //     }
  //     requestAnimationFrame(() => api.refreshHeader());
  //   };
  //   const timeoutId = setTimeout(() => {
  //     requestAnimationFrame(() => requestAnimationFrame(runAutoSize));
  //   }, 400);
  //   return () => clearTimeout(timeoutId);
  // }, [props.suppressAutoSizeColumns, props.rowData?.length, isOpenDrawer]);

  return (
    <Box
      sx={{
        backgroundColor: "white",
        p: props.customPadding ?? '24px',
        pb: props.height ? '70px' : '24px',
        marginBottom: props.height ? '24px' : '0px',
      }}
      display={"flex"}
      flexDirection={"column"}
      borderRadius={"12px"}
      gap={"1rem"}
      className="aggrid-root-box"
    >
      <Box
        flexGrow={1}
        sx={{
          backgroundColor: 'white',
        }}
      >
        <Box
          flexGrow={1}
          height={props.height ?? "auto"}
          minHeight={props.minHeight ?? "auto"}
          sx={{
            fontFamily: "'Roboto',sans-serif",
            position: 'relative',
            '& .ag-grid-body': {
              paddingTop: '24px',

              height: isEmpty ? '120px' : 'auto',

              '& .ag-cell': {
                display: 'flex',
                alignItems: 'center',

                '& .ag-cell-wrapper': {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }
              },

              '& .ag-center-cols-container, .ag-center-cols-viewport': {
                marginBottom: isEmpty ? '20px' : '0px',
                minHeight: isEmpty ? '120px' : 'auto',
              },

              '& .ag-overlay-wrapper': {
                alignItems: 'flex-start !important',
                paddingTop: '35px !important',
              },
            }

          }}
        >
          <Box className="ag-theme-quartz" sx={{ height: { md: "82%", lg: "87%", xs: "75%" }, position: "relative" }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} width={'100%'} gap={2}>
                <Box sx={{ flexShrink: 0, marginRight: '18px' }}>
                  {props.showSearchInput && (
                    <TextField
                      variant="outlined"
                      placeholder="Search"
                      size="small"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setInputSearch(e.target.value);
                        onChangeSearch(e.target.value || "");
                      }}
                      value={inputSearch}
                      sx={{
                        width: {
                          md: '200px',
                          sm: '180px'
                        },
                        '& .MuiOutlinedInput-root': {
                          height: '35px',
                          '& fieldset': {
                            borderRadius: '12px !important',
                          },
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconSearch size={12} />
                          </InputAdornment>
                        ),
                      }}
                    />

                  )}
                </Box>
                {props.customToolbarContent ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '18px',
                      flexShrink: 0,
                      ml: 'auto',
                    }}
                  >
                    {props.customToolbarContent}
                    <ActionButtonResponsive 
                      items={props.actionButton?.map(btn => ({
                      ...btn,
                      text: btn.text ?? "",
                    })) ?? []} />
                  </Box>
                ) : (
                  <ActionButtonResponsive items={props.actionButton?.map(btn => ({
                    ...btn,
                    text: btn.text ?? "",
                  })) ?? []} />
                )}
              </Box>
            </Box>
            <AgGridReact
              {
              ...Object.fromEntries(
                Object.entries(props).filter(
                  ([key, val]) => !['cardTitle', 'actionButton', 'customToolbarContent', 'gridRef', 'totalData', 'isLoading', 'height', 'showSearchInput', 'suppressAutoSizeColumns'].includes(key)
                )
              )
              }
              className="ag-grid-body"
              theme={myTheme}
              ref={props.gridRef}
              pagination
              loading={props.isLoading}
              suppressPaginationPanel
              paginationPageSize={props.paginationPageSize ?? 10}
              paginationPageSizeSelector={props.paginationPageSizeSelector ?? [10, 50, 100]}
              defaultColDef={defaultColDef}
              onSortChanged={onSortChanged}
              overlayLoadingTemplate={
                '<div aria-live="polite" aria-atomic="true" style="position:absolute;top:0;left:0;right:0; bottom:0; background: url(https://ag-grid.com/images/ag-grid-loading-spinner.svg) center no-repeat" aria-label="loading"></div>'
              }
              overlayNoRowsTemplate={noRowsOverlay}
              onGridReady={(params) => {
                setIsReadyGrid(true);
              }}
              animateRows={false}
              enableCellTextSelection={true}
              quickFilterParser={(text) => [text]}
              quickFilterMatcher={(quickFilter, value) => {
                const filterText = Array.isArray(quickFilter)
                  ? quickFilter.join(' ')
                  : quickFilter;

                return value
                  ?.toString()
                  .toLowerCase()
                  .includes(filterText.toLowerCase());
              }}

              domLayout={props.domLayout ?? "autoHeight"}
            />
            {isReadyGrid &&
              !props.isLoading &&
              !props.serverSideMode &&
              (props.rowData?.length ?? 0) > 0 &&
              props.gridRef.current?.api.getDisplayedRowCount() === 0 &&
              (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mt={4}
                >
                  <img src="/images/Match-not-found.png" width={40} />
                  <Typography fontSize={10} fontWeight={600} mt={0.5}>
                    No Data Yet
                  </Typography>

                  <Typography fontSize={9} color="#7C878E">
                    Try adding new entries
                  </Typography>
                </Box>
              )}

            <Box
              sx={{
                display: 'flex',
                flexDirection: {
                  xs: 'column-reverse',
                  md: 'row',
                },
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '27px',
                gap: '1rem'
              }}
            >
              <Box display={{ xs: 'none', md: 'block' }}>
                <Typography fontSize={'12px'} color={'#747272'}>
                  {(() => {
                    const currentLength = length ?? props.paginationPageSize ?? 10;

                    let totalEntries = 0;

                    if (props.serverSideMode) {
                      totalEntries = props.totalData ?? 0;
                    } else {
                      totalEntries = isReadyGrid
                        ? props.gridRef.current?.api.getDisplayedRowCount() ?? 0
                        : 0;
                    }

                    if (totalEntries === 0) {
                      return `Showing 0 to 0 of 0 entries`;
                    }

                    if (currentLength === -1) {
                      return `Showing 1 to ${totalEntries} of ${totalEntries} entries`;
                    }

                    const startEntry = (page - 1) * currentLength + 1;
                    const endEntry = Math.min(page * currentLength, totalEntries);

                    return `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;
                  })()}
                </Typography>
              </Box>
              <Box display={"flex"} justifyContent={{ xs: "start", md: "end" }} gap={"1rem"}>
                <StyledPagination
                  page={page}
                  onChange={onChangePagination}
                  count={(() => {
                    const currentLength = length ?? props.paginationPageSize ?? 10;
                    if (currentLength === -1) return 1; // Only 1 page when "All" is selected
                    return paginationTotalPage ?? Math.ceil((props.serverSideMode ? props.totalData : isReadyGrid ? props.gridRef.current!.api.getDisplayedRowCount() ?? 0 : 0) / currentLength);
                  })()}
                  color="primary"
                  shape="rounded"
                  siblingCount={isSmallScreen ? 0 : 1}
                />
              </Box>
              <Box>
                <Box
                  sx={{
                    display: "inline-block",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    '& .MuiInputBase-root': {
                      height: '28px !important',
                      width: '112px !important',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderRadius: '20px'
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#000',
                      background: 'transparent'
                    }
                  }}
                >
                  <Typography
                    sx={{
                      display: "inline-block",
                      marginRight: "10px",
                    }}
                  >
                    Show
                  </Typography>
                  <Select
                    variant="outlined"
                    value={length ?? props.paginationPageSize ?? 10}
                    size="small"
                    onChange={onChangePageSize}
                  >
                    {props.paginationPageSizeSelector != null
                      ? (props.paginationPageSizeSelector as number[]).map((item: number) => (
                        <MenuItem key={item} value={item}>
                          {item === -1 ? 'All' : `${item} rows`}
                        </MenuItem>
                      ))
                      : [10, 50, 100].map((item: number) => (
                        <MenuItem key={item} value={item}>
                          {item} rows
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AGGrid;
