import {FormField} from "./form.field";
import {SelectOptionValue} from "./select.option.value";

export class SelectField extends FormField {
  selectOptionValues: SelectOptionValue[];
  length: number;
  maxLength: number;
  defaultValue: SelectOptionValue;
}
