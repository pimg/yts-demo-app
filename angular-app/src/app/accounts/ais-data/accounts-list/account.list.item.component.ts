import {Component, Input} from "@angular/core";
import {AccountListItem} from "./account.list.item";

@Component({
  selector: 'account-list-item',
  templateUrl: './account.list.item.component.html'
})
export class AccountListItemComponent {

  @Input()
  public accountListItem: AccountListItem;

}
