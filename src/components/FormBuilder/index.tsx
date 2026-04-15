import { Box, Button, Card, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { IField, IForm, IFormLayout } from "./interfaces"
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form"
import { ReactNode } from "react"

const generateField = <T extends FieldValues>(
  valueField: IField,
  control: Control<T>,
  errors: FieldErrors<T>
): ReactNode => {
    
    return(
        <Grid item xs={valueField.width || 12} key={valueField.fieldName}>
            <Controller
                name={valueField.fieldName as any}
                control={control}
                render={({ field }) => {
                    return <FormControl 
                        error={ errors[valueField.fieldName as keyof typeof errors] != undefined} 
                        variant="standard"
                        required={valueField.required}
                        disabled = {valueField.disabled}
                        fullWidth
                        size="small"
                    >
                        <InputLabel 
                            id={`${valueField.fieldName}-label`}
                            htmlFor={valueField.fieldName} 
                            sx={{
                                fontSize: '1rem',
                                color: '#364152',
                                fontWeight: '500',
                                position: 'relative'
                            }}
                            shrink
                        >
                            {valueField.label}
                        </InputLabel>
                        {
                            valueField.select && <Select
                                {...field}
                                aria-describedby={`${valueField.fieldName}-text`}
                                id={valueField.fieldName}
                                fullWidth
                                labelId={`${valueField.fieldName}-label`}
                                multiple={valueField.multiple}
                                variant="outlined"
                                autoFocus={valueField.autoFocus}
                                disabled={valueField.disabled}
                                placeholder={valueField.placeholder}

                                // displayEmpty={valueField.placeholder ? true : false}
                                // renderValue={(value: any) => {
                                //   if (!value) {
                                //     return <Typography color="gray">{valueField.placeholder}</Typography>;
                                //   }
                                //   return value;
                                // }}
                            >
                                {
                                    valueField.select && (valueField.selectItem || []).map(
                                        (valueSelectItem, indexSelectItem) => 
                                        <MenuItem key={valueSelectItem.value} value={valueSelectItem.value}>
                                            {valueSelectItem.label}
                                        </MenuItem>
                                    ) 
                                }
                            </Select>
                        }
                        {
                            valueField.check && <FormControlLabel
                                control={
                                    <Checkbox {...field} disabled={valueField.disabled}/>
                                }
                                label={valueField.checkLabel}
                            />
                        }
                        {
                            valueField.custom && <>{valueField.customContent}</>
                        }
                        {
                            !valueField.select && !valueField.check && !valueField.custom && <TextField
                                {...field}
                                id={valueField.fieldName}
                                aria-describedby={`${valueField.fieldName}-text`}
                                autoComplete={valueField.fieldName}
                                autoFocus={valueField.autoFocus}
                                multiline = {valueField.multiline}
                                rows = {valueField.rows}
                                type={valueField.type}
                                variant="outlined"
                                size="small"
                                disabled={valueField.disabled}
                                inputProps={{ maxLength: valueField.maxLength }}
                                error={!!errors[valueField.fieldName as keyof typeof errors]?.message}
                                onChange={(e) => {
                                    field.onChange(valueField.transform?.(e.target.value) ?? e.target.value)
                                }}
                            />
                        }
                        
                        <FormHelperText id={`${valueField.fieldName}-text`}>
                            { errors[valueField.fieldName as keyof typeof errors]?.message as string }
                        </FormHelperText>
                    </FormControl>
                    }
                }
            />
        </Grid>
    )
}

const generateCard = (value: IFormLayout,control : any, errors : any) => {
    return(
        <Grid item xs={value.width}>
            <Card
                sx={{
                    borderRadius: '5px',
                    border: '1px solid #BDBDDD',
                    marginBottom: '16px'
                }}
            >
                <CardHeader 
                    title={value.title}
                    sx={{
                        backgroundColor: '#F5F5F9',
                    }}
                    titleTypographyProps={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#566A7F'
                    }}
                    action={
                        value.headerAction
                    }
                />
                <CardContent
                    sx={{
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}
                >
                    <Grid container spacing={'1rem'}>
                        {
                            (value.fields || []).map((valueField, indexField) => {
                                return(
                                    generateField(valueField,control,errors)
                                )
                            })
                        }
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}
type FormBuilderProps<T extends FieldValues> = {
  formLayout: IFormLayout[];
  control: Control<T>;
  errors: FieldErrors<T>;
  withCard?: boolean;
};

const FormBuilder = <T extends FieldValues>({
  formLayout,
  control,
  errors,
  withCard = true
}: FormBuilderProps<T>) => {
    
    if(!withCard){
        return(
            <Grid container spacing={'1rem'}>
            {
                formLayout.map((value,index) => 
                    <Grid item xs={value.width} key={index}>
                        <Grid container spacing={'1rem'}>
                            {
                                (value.fields || []).map((valueField, indexField) => {
                                    return(
                                        generateField(valueField,control,errors)
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                )
            }
            </Grid>
        )
    }
    return(
        <Grid container spacing={'1rem'}>
        {
            formLayout.map((value,index) => {
                if(value.group){
                    return(
                        <Grid item xs={value.width} key={index}>
                            {
                                value.group.map((groupValue,groupIndex) => {
                                    return(
                                        generateCard(groupValue,control,errors)
                                    )
                                })
                            }
                        </Grid>
                    )
                }
                return generateCard(value,control,errors)
            }
            )
        }
        </Grid>
    )
}

export default FormBuilder