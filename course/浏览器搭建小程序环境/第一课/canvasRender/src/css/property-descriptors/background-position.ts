import {PropertyDescriptorParsingType, IPropertyListDescriptor} from '../IPropertyDescriptor';
import {CSSValue, parseFunctionArgs} from '../syntax/parser';
import {isLengthPercentage, LengthPercentageTuple, parseLengthPercentageTuple} from '../types/length-percentage';
export type BackgroundPosition = BackgroundImagePosition[];

export type BackgroundImagePosition = LengthPercentageTuple;

export const backgroundPosition: IPropertyListDescriptor<BackgroundPosition> = {
    name: 'background-position',
    initialValue: '0% 0%',
    type: PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: (tokens: CSSValue[]): BackgroundPosition => {
        return parseFunctionArgs(tokens)//处理空白字段分割
            .map((values: CSSValue[]) => values.filter(isLengthPercentage))//过滤数字和百分比
            .map(parseLengthPercentageTuple);//获取解释之后的位置数据
    }
};
