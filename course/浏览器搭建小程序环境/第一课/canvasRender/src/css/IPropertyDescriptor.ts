import {CSSValue} from './syntax/parser';
import {CSSTypes} from './types/index';

//css样式的属性值解析方式枚举
export enum PropertyDescriptorParsingType {
    VALUE,//解析值
    LIST,//选项值
    IDENT_VALUE,//标识值
    TYPE_VALUE,//类型值
    TOKEN_VALUE//token值
}

//基本每一个样式属性值的构建结构
export interface IPropertyDescriptor {
    name: string;//样式名称
    type: PropertyDescriptorParsingType;//属性类型
    initialValue: string;//初始值
    prefix: boolean;
}

export interface IPropertyIdentValueDescriptor<T> extends IPropertyDescriptor {
    type: PropertyDescriptorParsingType.IDENT_VALUE;
    parse: (token: string) => T;
}

export interface IPropertyTypeValueDescriptor extends IPropertyDescriptor {
    type: PropertyDescriptorParsingType.TYPE_VALUE;
    format: CSSTypes;
}

export interface IPropertyValueDescriptor<T> extends IPropertyDescriptor {
    type: PropertyDescriptorParsingType.VALUE;
    parse: (token: CSSValue) => T;
}

export interface IPropertyListDescriptor<T> extends IPropertyDescriptor {
    type: PropertyDescriptorParsingType.LIST;
    parse: (tokens: CSSValue[]) => T;
}

export interface IPropertyTokenValueDescriptor extends IPropertyDescriptor {
    type: PropertyDescriptorParsingType.TOKEN_VALUE;
}

export type CSSPropertyDescriptor<T> =
    | IPropertyValueDescriptor<T>
    | IPropertyListDescriptor<T>
    | IPropertyIdentValueDescriptor<T>
    | IPropertyTypeValueDescriptor
    | IPropertyTokenValueDescriptor;
