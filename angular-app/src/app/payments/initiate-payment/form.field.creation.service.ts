import {Injectable} from "@angular/core";
import {FormFieldBase} from "./form.field.base";
import {FormControl, FormGroup, Validators} from "@angular/forms";

/**
 * Taken from https://angular.io/guide/dynamic-form tutorial
 */
@Injectable()
export class FormFieldCreationService {
  constructor() {
  }

  toFormGroup(questions: FormFieldBase<string>[]) {
    const group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required) : new FormControl(question.value || '');
    });

    return new FormGroup(group);
  }

}
