// Source: https://dirask.com/snippets/JavaScript-parse-truthy-string-values-to-boolean-1-true-on-yes-t-y-0-false-off-no-f-n-DWBQG1
//
const parseBoolean = exports.parseBoolean = (text) => {
    switch(text) {
        case '1':
        case 'true':
        case 'True':
        case 'TRUE':
        case 'on':
        case 'On':
        case 'ON':
        case 'yes':
        case 'Yes':
       	case 'YES':
        case 't':
        case 'T':
        case 'y':
        case 'Y':
            return true;
        case '0':
        case 'false':
        case 'False':
        case 'FALSE':
        case 'off':
        case 'Off':
        case 'OFF':
        case 'no':
        case 'No':
        case 'NO':
        case 'f':
        case 'F':
        case 'n':
        case 'N':
            return false;
        default:
            throw new Error('Incorrect value!');
    }
};