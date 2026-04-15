import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save } from "@mui/icons-material";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import { Dialogs } from "@/components/dialog";
import { RootState } from "@/lib/redux/store";
import { CREATE_DAILY_MANPOWER, UPDATE_DAILY_MANPOWER } from "@/lib/redux/types";
import { WithId } from "@/type/services";
import { UpsertDailyManPowerRequest, upsertDailyManPowerSchema } from "./schema";
import { TextControlWidget } from "@/components/Input/TextControlWidget";
import { dailyManPowerActions } from "@/lib/redux/slices/transaction/dailyManPower";

type FormType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: UpsertDailyManPowerRequest & WithId;
  onUpsert?: () => void;
  readonly?: boolean;
};

const UpsertForm = ({ open, setOpen, data, ...props }: FormType) => {
  const dispatch = useDispatch();
  const { fetching } = useSelector((state: RootState) => state.dailyManPower);
  const { severity } = useSelector((state: RootState) => state.notification);
  const { handleSubmit, reset, ...form } = useForm({
    resolver: yupResolver(upsertDailyManPowerSchema),
    defaultValues: {
      witel: "",
      total_surveyor: 0,
      total_drafter: 0,
      total_pt2: 0,
      total_pt3: 0,
      total_order: 0,
      notes: "",
      date: null,
    },
  });

  useEffect(() => {
    if (data?.id) {
      reset(data);
    } else {
      reset({
        witel: "",
        total_surveyor: 0,
        total_drafter: 0,
        total_pt2: 0,
        total_pt3: 0,
        total_order: 0,
        notes: "",
        date: null,
      });
    }
  }, [data, dispatch, open, reset]);

  useEffect(() => {
    if (severity == "success") {
      reset();
      setOpen(false);
      props.onUpsert?.();
      dispatch(dailyManPowerActions.setIsFiltered(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity]);

  const onSubmit: SubmitHandler<UpsertDailyManPowerRequest> = (values) => {
    if (data?.id) {
      dispatch({
        type: UPDATE_DAILY_MANPOWER,
        payload: { id: data.id, ...values },
      });
    } else {
      dispatch({ type: CREATE_DAILY_MANPOWER, payload: { ...values } });
    }
  };

  return (
    <Dialogs open={open} title={`Form ${data?.id ? "Edit" : "Add"}`} setOpen={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={"1rem"} justifyContent={"center"}>
          <Grid item xs={12} md={12}>
            <TextControlWidget control={form.control} name="witel" label="Witel*" type="text" maxLength={225} autoFocus disabled={props.readonly} labelOnTextField />
            <TextControlWidget control={form.control} name="total_surveyor" label="Total Surveyor*" type="number" maxLength={3} disabled={props.readonly} labelOnTextField />
            <TextControlWidget control={form.control} name="total_drafter" label="Total Drafter*" type="number" maxLength={3} disabled={props.readonly} labelOnTextField />
            <TextControlWidget control={form.control} name="total_pt2" label="Total PT2*" type="number" maxLength={3} disabled={props.readonly} labelOnTextField />
            <TextControlWidget control={form.control} name="total_pt3" label="Total PT3*" type="number" maxLength={3} disabled={props.readonly} labelOnTextField />
            <TextControlWidget control={form.control} name="total_order" label="Total Order*" type="number" maxLength={3} disabled={props.readonly} labelOnTextField />
            <TextControlWidget control={form.control} name="notes" label="Notes" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
            {!props.readonly && !!data?.id && (
              <Box marginY={1}>
                <Controller
                  name="date"
                  control={form.control}
                  render={({ field }) => (
                    <DatePicker
                      label="Date"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => field.onChange(newValue ? newValue.toDate() : null)}
                      format="DD MMM YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true
                        },
                      }}
                    />
                  )}
                />
              </Box>
            )}
          </Grid>
        </Grid>
        {!props.readonly && (
          <Box display={"flex"} flexDirection={"row-reverse"} justifyContent={"end"} width={"100%"} marginTop={"1rem"} gap={"1rem"}>
            <Button color="primary" variant="contained" size="small" type="submit" startIcon={<Save />} endIcon={fetching && <CircularProgress color="inherit" size={"1rem"} />} disabled={fetching}>
              Submit
            </Button>
          </Box>
        )}
      </form>
    </Dialogs>
  );
};

export default UpsertForm;
