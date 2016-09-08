export const zxx = 'Yiyun_max';
export const mao = 'Yiyun_mao';

let day = 0;


export const ChangeMax = (content) => {
  return {
    type: zxx,
    num: day++,     //num获取不到？？？
    content
  }
}

export const ChangeMao = (content) => {
  return {
    type: mao,
    num: day++,
    content
  }
}