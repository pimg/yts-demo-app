import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {FormFieldBase} from "./form.field.base";
import {FormFieldCreationService} from "./form.field.creation.service";


@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic.form.component.html',
  providers: [ FormFieldCreationService ]
})
export class DynamicFormComponent implements OnInit {

  @Input() fields: FormFieldBase<string>[] | null = [];
  form!: FormGroup;
  payLoad = '';

  constructor(private qcs: FormFieldCreationService) {}

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.fields as FormFieldBase<string>[]);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }
}
