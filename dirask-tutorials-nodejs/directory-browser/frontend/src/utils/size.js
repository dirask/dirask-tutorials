const SHORT_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
const FULL_UNITS = ['bytes', 'kilobytes', 'megabytes', 'gigabytes', 'terabytes', 'petabytes'];

export const roundPrecised = (number, precision) => {
	const power = Math.pow(10, precision);
  	return Math.round(number * power) / power;
};

export const calculateSize = (bytes, units = SHORT_UNITS) => {
    if (bytes === 0) {
        return {
            value: 0,
            unit: units[0] ?? 'B'
        }; 
    }
    const level = Math.floor(Math.log(bytes) / Math.log(1024));
    const index = Math.min(level, units.length - 1);
    return {
        value: bytes / Math.pow(1024, index),
        unit: units[index] ?? 'B'
    };
};

export const renderSize = (bytes, precision = 2, units = SHORT_UNITS, spacer = '') => {
    const size = calculateSize(bytes, units);
    const value = roundPrecised(size.value, precision);
    return value + spacer + size.unit;
};

export const printSize = (bytes, precision = 2, units = SHORT_UNITS, spacer = '') => {
    console.log(renderSize(bytes, precision, units, spacer));
};