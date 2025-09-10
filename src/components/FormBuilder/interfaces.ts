import { ReactNode } from "react"
import { Control, FieldErrors } from "react-hook-form"

export interface IForm{
    formLayout : IFormLayout[]
    withCard? : boolean
    control : Control<any>
    errors : FieldErrors<{[key: string] : any}>
}

export interface IField {
    fieldName: string,
    label: string,
    type?: React.InputHTMLAttributes<unknown>['type'];
    disabled? : boolean
    select? : boolean
    selectItem? : {
        value: any,
        label: any
    }[],
    multiple? : boolean
    check?: boolean,
    checkLabel? : string,
    required? : boolean
    multiline? : boolean
    rows? : number
    width? : 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    maxLength? : number,
    autoFocus? : boolean,
    custom?: boolean,
    customContent?: ReactNode,
    placeholder?: string
    transform?: (value: any) => any
}

export interface IFormLayout {
    width: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    title?: string,
    fields?: IField[],
    headerAction? : ReactNode,
    group? : IFormLayout[]
}