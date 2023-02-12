// Source:
//
//     https://dirask.com/snippets/JavaScript-render-datetime-as-YYYY-MM-DD-hh-mm-ss-date-time-format-pJaeqD


const renderNumber = (number, length) => {
    let result = String(number);
    for (let i = result.length; i < length; ++i) {
        result = '0' + result;
    }
    return result;
};

const render2Number = (number) => renderNumber(number, 2);
const render3Number = (number) => renderNumber(number, 3);
const render4Number = (number) => renderNumber(number, 4);

export const renderDate = (date) => {
    const y = render4Number(date.getFullYear());
    const m = render2Number(date.getMonth() + 1);
    const d = render2Number(date.getDate());
    return `${y}-${m}-${d}`;
};

export const renderTime = (date) => {
    const h = render2Number(date.getHours());
    const m = render2Number(date.getMinutes());
    const s = render2Number(date.getSeconds());
    return `${h}:${m}:${s}`;
};

export const renderDatetime = (date = new Date()) => {
    const d = renderDate(date);
    const t = renderTime(date);
    return `${d} ${t}`;
};