import { inputConf } from "./control/Input";
import { radioConf } from "./control/Radio";
import { selectConf } from "./control/Select";
import { checkBoxConf } from "./control/CheckBox";
import { datePickerConf } from './control/DatePicker';
import { hrConf } from "./control/Hr";
// import { pConf } from "./control/P";
// import { uploadsConf } from './control/Uploads';
import { addressConf } from './control/Address';
import { textConf } from "./control/Text";
// import { titleConf } from "./control/Title";

const formList = {
  input: inputConf,
  radio: radioConf,
  select :selectConf,
  checkBox: checkBoxConf,
  datepicker: datePickerConf,
  hr: hrConf,
  // p: pConf,
  address: addressConf,
  // uploads: uploadsConf,
  // title: titleConf,
  text: textConf
};
let list_arr = [];
for (let i in formList) {
  list_arr.push({
    ele: i,
    obj: formList[i]
  });
}
export default list_arr;
