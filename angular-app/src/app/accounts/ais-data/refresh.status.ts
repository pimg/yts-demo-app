export class RefreshStatus {
  private dataSaved: boolean;

  public isDataSaved(): boolean {
    return this.dataSaved;
  }

  public setDataSaved() {
    this.dataSaved = true;
  }
}
