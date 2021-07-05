import {FormField} from "./form.field";
import {ExplanationField} from "./explanation.field";

export class FormStep {
  formComponents: FormField[];
  explanationField: ExplanationField;
  stateId: string;
}
