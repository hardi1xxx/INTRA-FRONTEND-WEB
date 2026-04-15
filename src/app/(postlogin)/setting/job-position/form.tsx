import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save } from "@mui/icons-material";
import { Box, Button, CircularProgress } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Dialogs } from "@/components/dialog";
import FormBuilder from "@/components/FormBuilder";
import { IFormLayout } from "@/components/FormBuilder/interfaces";
import { RootState } from "@/lib/redux/store";
import { UpsertJobPositionRequest, upsertJobPositionSchema } from "./schema";
import { CREATE_MASTER_JOB_POSITION, UPDATE_MASTER_JOB_POSITION } from "@/lib/redux/types";
import { WithId } from "@/type/services";

type FormType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: UpsertJobPositionRequest & WithId;
  onUpsert?: () => void;
};

const UpsertForm = ({ open, setOpen, data, onUpsert }: FormType) => {
  const dispatch = useDispatch();
  const { fetching } = useSelector((state: RootState) => state.jobPosition);
  const { severity } = useSelector((state: RootState) => state.notification);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(upsertJobPositionSchema),
    defaultValues: { job_position: "" },
  });

  const formLayout: IFormLayout[] = [
    {
      width: 12,
      title: "Job Position",
      fields: [
        {
          fieldName: "job_position",
          label: "Job Position",
          autoFocus: true,
          required: true,
          maxLength: 255,
        },
        ...(!data
          ? []
          : [
              {
                fieldName: "status",
                label: "Status",
                select: true,
                selectItem: [
                  { value: 1, label: "Active" },
                  { value: 0, label: "Inactive" },
                ],
              },
            ]),
      ],
    },
  ];

  useEffect(() => {
    if (data?.id) {
      reset(data);
    } else {
      reset({ job_position: "" });
    }
  }, [data, open, reset]);

  useEffect(() => {
    if (severity == "success") {
      reset();
      setOpen(false);
      onUpsert?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity]);

  const onSubmit: SubmitHandler<UpsertJobPositionRequest> = (values) => {
    if (data?.id) {
      dispatch({
        type: UPDATE_MASTER_JOB_POSITION,
        payload: { id: data.id, ...values },
      });
    } else {
      dispatch({ type: CREATE_MASTER_JOB_POSITION, payload: { ...values } });
    }
  };

  return (
    <Dialogs open={open} title={`Form ${data?.id ? "Edit" : "Add"} JobPosition`} setOpen={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormBuilder formLayout={formLayout} control={control} errors={errors} withCard={false} />
        <Box display={"flex"} flexDirection={"row-reverse"} justifyContent={"end"} width={"100%"} marginTop={"1rem"} gap={"1rem"}>
          <Button color="primary" variant="contained" size="small" type="submit" startIcon={<Save />} endIcon={fetching && <CircularProgress color="inherit" size={"1rem"} />} disabled={fetching}>
            Submit
          </Button>
        </Box>
      </form>
    </Dialogs>
  );
};

export default UpsertForm;
