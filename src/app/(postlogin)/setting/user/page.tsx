/* eslint-disable @next/next/no-img-element */
"use client";

import ActionButtonResponsive, { ActionButtonResponseType } from "@/components/ActionButtonResponsive";
import MainPage from "@/components/MainPage";
import { checkAccessCreate, checkAccessDelete, checkAccessEdit, dateTimeFormat } from "@/components/helper";
import { RootState } from "@/lib/redux/store";
import { DELETE_MASTER_USER, EXPORT_MASTER_USER, GET_MASTER_USER, UPDATE_MASTER_USER } from "@/lib/redux/types";
import { Avatar, Box, ButtonPropsColorOverrides, ButtonPropsSizeOverrides, ButtonPropsVariantOverrides, CircularProgress, ListItemIcon, SxProps, Theme } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormUser from "./form";
import { Add, IosShare, PersonRounded } from "@mui/icons-material";
import FilterUser from "./filter";
import { ColDef, GetRowIdParams, ICellRendererParams, IRowNode } from "ag-grid-community";
import DataGridAction, { DataGridActionType } from "@/components/DataGridAction";
import { GridRenderCellParams } from "@mui/x-data-grid";
import AGGrid, { CustomAGGridProps } from "@/components/AGGrid";
import { AgGridReact } from "ag-grid-react";
import { DataUser, receiveUser } from "@/lib/redux/slices/master/user";
import CustomSwitch from "@/components/Switch";
import DetailUser from "./detail";
import { usePathname } from 'next/navigation'
import { OverridableStringUnion } from "@mui/types";

function MasterUserPage() {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const pathname = usePathname()

  const { params, rows, recordsTotal, fetching, fetchingExport } = useSelector((state: RootState) => state.user);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [resetSearch, setResetSearch] = useState<boolean>(false)
  const [pageProps, setPageProps] = useState<{
    start: number;
    length: number;
    order: string;
    search: string;
  }>({
    start: 0,
    length: 10,
    order: "",
    search: "",
  });

  const [openForm, setOpenForm] = useState<boolean>(false);

  const [selectedData, setSelectedData] = useState<DataUser>({});

  const [openDetail, setOpenDetail] = useState<boolean>(false)

  // define columns table
  const columns: ColDef<DataUser & { no?: string; action?: string }, any>[] = [
    {
      field: "no",
      headerName: "No.",
      width: 70,
      minWidth: 70,
      pinned: "left",
      sortable: false,
      valueGetter: (props) => {
        return (props.node?.rowIndex ?? 0) + pageProps.start + 1;
      },
    },
    {
      field: "nik",
      headerName: "NIK",
      minWidth: 150,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
    },
    {
      field: "role_name",
      headerName: "Role",
      minWidth: 150,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 150,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value ?? '-'
      }
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      minWidth: 150,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value ?? '-'
      }
    },
    {
      field: "job_position_name",
      headerName: "Job Position",
      minWidth: 150,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value ?? '-'
      }
    },
    {
      field: "departement_name",
      headerName: "Departement User",
      minWidth: 150,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value ?? '-'
      }
    },
    {
      field: "picture",
      headerName: "Photo Profile",
      minWidth: 120,
      cellClass: "text-center",
      sortable: false,
      cellRenderer: (params: any) => {
        return <ListItemIcon sx={{ paddingRight: '8px' }}>
          <Avatar>
            {params.value != null ? <img src={`${(process.env.NEXT_PUBLIC_TARGET_API)?.replace('/api', '/storage/') + (params.value || '')}?t=${(new Date()).getTime()}`} style={{ width: 38, height: 38, borderRadius: '100%' }} alt={params.data.name} /> : <PersonRounded sx={{ fontSize: 38 }} />}
          </Avatar>
        </ListItemIcon>
      }
    },
    {
      field: "is_web",
      headerName: "Is Web",
      minWidth: 150,
      cellRenderer: (row: IRowNode<DataUser & { no?: string, action?: string }>) => {
        if (checkAccessEdit(pathname.substring(1))) {
          return <CustomSwitch
            checked={row.data!.is_web == "1"}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const rowNode = gridRef.current!.api.getRowNode(row.data?.id?.toString() ?? "0")!;
              rowNode.updateData({ ...row.data!, is_web: event.target.checked ? "1" : "0" })
              dispatch({
                type: UPDATE_MASTER_USER,
                id: row.data?.id,
                data: {
                  ...row.data!,
                  is_web: event.target.checked ? "1" : "0",
                  picture: null,
                }
              })
            }}
          />
        } else {
          return row.data!.is_web == "1" ? 'Active' : 'Inactive'
        }
      }
    },
    {
      field: "is_app",
      headerName: "Is App",
      minWidth: 150,
      cellRenderer: (row: IRowNode<DataUser & { no?: string, action?: string }>) => {
        if (checkAccessEdit(pathname.substring(1))) {
          return <CustomSwitch
            checked={row.data!.is_app == "1"}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const rowNode = gridRef.current!.api.getRowNode(row.data?.id?.toString() ?? "0")!;
              rowNode.updateData({ ...row.data!, is_app: event.target.checked ? "1" : "0" })
              dispatch({
                type: UPDATE_MASTER_USER,
                id: row.data?.id,
                data: {
                  ...row.data!,
                  is_app: event.target.checked ? "1" : "0",
                  picture: null,
                }
              })
            }}
          />
        } else {
          return row.data!.is_app == "1" ? 'Active' : 'Inactive'
        }
      }
    },
    {
      field: "created_at",
      headerName: "Created At",
      minWidth: 170,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value != null ? dateTimeFormat(params.value) : "-";
      },
    },
    {
      field: "created_nik",
      headerName: "Created NIK",
      minWidth: 170,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value ?? "-";
      },
    },
    {
      field: "created_by",
      headerName: "Created By",
      minWidth: 170,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value ?? "-";
      },
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      minWidth: 170,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value != null ? dateTimeFormat(params.value) : "-";
      },
    },
    {
      field: "updated_nik",
      headerName: "Updated NIK",
      minWidth: 170,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value ?? "-";
      },
    },
    {
      field: "updated_by",
      headerName: "Updated By",
      minWidth: 170,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value ?? "-";
      },
    },
    // action button
    {
      field: "action",
      headerName: "Action",
      width: 80,
      pinned: "right",
      editable: false,
      sortable: false,
      cellRenderer: (params: ICellRendererParams<any>) => {
        const dataActions: DataGridActionType = {
          item: [
            {
              text: "Detail",
              onClick: () => {
                setSelectedData(params.data)
                setOpenDetail(true)
              },
            },
          ]
        }
        if (checkAccessEdit(pathname.substring(1))) {
          dataActions.item.push({
            text: 'Edit',
            onClick: () => {
              setSelectedData({
                ...params.data,
                role_id: params.data.role_id.toString(),
                departement_id: params.data.departement_id ? params.data.departement_id.toString() : "",
              })
              setOpenForm(true)
            }
          })
        }
        if (checkAccessDelete(pathname.substring(1))) {
          dataActions.item.push({
            text: 'Delete',
            onClick: () => {
              confirm({ description: "Are you sure to delete this data?" })
                .then(() => {
                  dispatch({ type: DELETE_MASTER_USER, id: params.data.id })
                })
                .catch((err) => {

                })
            }
          })
        }
        return (
          <DataGridAction item={dataActions.item} />
        )
      }
    },
  ];

  // function create button
  const onCreateButtonClick = () => {
    setOpenForm(true);
    setSelectedData({});
  };

  // function export excel
  const onExportButtonClick = () => {
    dispatch({ type: EXPORT_MASTER_USER });
  };

  const gridRef = useRef<AgGridReact>(null);
  const getRowId = useCallback((params: GetRowIdParams<any>): any => {
    return params.data.id ?? 0;
  }, []);

  // function for parsing get order param
  const getOrderParam = (order: string) => {
    let orderParam = "";
    if (order != "") {
      for (const splitted of order.split("|")) {
        const split = splitted.split(",");
        if (split[1] != "null" && split[1] != "undefined") {
          switch (split[0]) {
            case "nik":
              orderParam += `users.nik,${split[1]}`;
              break;
            case "name":
              orderParam += `users.name,${split[1]}`;
              break;
            case "role_name":
              orderParam += `m_role.role,${split[1]}`;
              break;
            case "departement_name":
              orderParam += `m_departement_user.departement,${split[1]}`;
              break;
            case "job_position_name":
              orderParam += `m_job_position.job_position,${split[1]}`;
              break;
            case "email":
              orderParam += `users.email,${split[1]}`;
              break;
            case "phone_number":
              orderParam += `users.phone_number,${split[1]}`;
              break;
            case "is_web":
              orderParam += `users.is_web,${split[1] == 'asc' ? 'desc' : split[1] == 'desc' ? 'asc' : ''}`
              break
            case "is_app":
              orderParam += `users.is_app,${split[1] == 'asc' ? 'desc' : split[1] == 'desc' ? 'asc' : ''}`
              break
            case "created_at":
              orderParam += `users.created_at,${split[1]}`
              break
            case "created_nik":
              orderParam += `users.created_nik,${split[1]}`
              break
            case "created_by":
              orderParam += `users.created_by,${split[1]}`
              break
            case "updated_at":
              orderParam += `users.updated_at,${split[1]}`
              break
            case "updated_nik":
              orderParam += `users.updated_nik,${split[1]}`
              break
            case "updated_by":
              orderParam += `users.updated_by,${split[1]}`
              break
            default:
              orderParam += `users.id,asc`;
              break;
          }
        }
      }
    } else {
      orderParam = "users.id,asc"
    }
    return orderParam;
  };

  // function for get data with serverside method
  const onServerSidePropsChange: CustomAGGridProps["onServerSidePropsChange"] = (data) => {
    setPageProps({
      start: data.start,
      length: data.length,
      order: getOrderParam(data.order),
      search: data.search,
    });
    setResetSearch(false)
    if (isFiltered) {
      dispatch({
        type: GET_MASTER_USER,
        params: {
          ...params,
          start: data.start,
          length: data.length,
          search: data.search,
          order_param: getOrderParam(data.order),
        },
      });
    } else {
      dispatch(receiveUser({
        data: [],
        recordsFiltered: 0,
        params: {
          type: "table",
          column: "",
          filter_param: "",
          order_param: "",
          start: 0,
          length: 10,
          search: "",
        }
      }))
    }
  };

  const [actionButtons, setActionButtons] = useState<ActionButtonResponseType>({ items: [] })

  useEffect(() => {
    const temp: ActionButtonResponseType = {
      items: []
    }
    if (checkAccessCreate(pathname.substring(1))) {
      temp.items.push({
        color: "primary",
        variant: "contained",
        size: "small",
        onClick: onCreateButtonClick,
        text: "Create Data",
        startIcon: <Add />,
      })
    }
    setActionButtons(temp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <MainPage title="Setting User">
      <FilterUser pageProps={pageProps} setIsFiltered={setIsFiltered} setResetSearch={setResetSearch} />
      <Box
        sx={{
          backgroundColor: "white",
        }}
        display={"flex"}
        flexDirection={"column"}
        // width={"calc(100% - 40px)"}
        p={"10px"}
        paddingY={"15px"}
        pb={"20px"}
        borderRadius={"8px"}
        gap={"1rem"}
      // flexGrow={0.1}
      >
        <ActionButtonResponsive
          items={[{
            color: "info",
            variant: "contained",
            size: "small",
            onClick: onExportButtonClick,
            text: "Export Excel",
            disabled: fetchingExport || rows.length === 0,
            endIcon: fetchingExport && <CircularProgress color="inherit" size={"1rem"} />,
            startIcon: <IosShare />,
          }, ...actionButtons.items]}
        />
        <Box
          flexGrow={1}
          height={"550px"}
          sx={{
            backgroundColor: "white",
          }}
        >
          <AGGrid 
            gridRef={gridRef} 
            rowData={rows} 
            columnDefs={columns} 
            totalData={recordsTotal} 
            getRowId={getRowId} 
            isLoading={fetching}
            height={"562px"} 
            showSearchInput 
            serverSideMode 
            onServerSidePropsChange={onServerSidePropsChange} 
            resetSearch={resetSearch} 
          />
        </Box>
      </Box>
      <FormUser open={openForm} setOpen={setOpenForm} data={selectedData} setIsFiltered={setIsFiltered} />
      <DetailUser open={openDetail} setOpen={setOpenDetail} id={selectedData.id} />
    </MainPage>
  );
}

export default MasterUserPage;
