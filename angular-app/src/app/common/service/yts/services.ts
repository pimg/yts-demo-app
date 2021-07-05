export class Services {
  ais: AIS;
  pis: PIS;
}

class AIS {
  onboarded: Onboarded;
  hasRedirectSteps: boolean;
  hasFormSteps: boolean;
}

class PIS {
  onboarded: Onboarded;
  hasRedirectSteps: boolean;
  hasFormSteps: boolean;
  singleSepa: PaymentDetails;
  ukDomesticSingle: PaymentDetails;
  scheduledSepa: PaymentDetails;
  scheduledUkDomestic: PaymentDetails;
  periodicSepa: PeriodicPaymentDetails;
  ukDomesticPeriodic: PeriodicPaymentDetails;
}

class Onboarded {
  redirectUrlIds: string[];
  client: boolean;
}

class PaymentDetails {
  supported: boolean;
  dynamicFields: DynamicFields;
}

class PeriodicPaymentDetails extends PaymentDetails {
  supportedFrequencies: string[];
}

class DynamicFields {
  creditorAgentBic: DynamicField;
  creditorAgentName: DynamicField;
  remittanceInformationStructured: DynamicField;
  creditorPostalAddressLine: DynamicField;
  creditorPostalCountry: DynamicField;
  debtorName: DynamicField;
}

class DynamicField {
  required: boolean;
}
