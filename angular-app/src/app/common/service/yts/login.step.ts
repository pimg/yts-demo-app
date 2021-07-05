import {FormStep} from "./form.step";
import {RedirectStep} from "./redirect.step";

export class LoginStep {
  form: FormStep;
  redirect: RedirectStep;
  userSiteId: string;
}
