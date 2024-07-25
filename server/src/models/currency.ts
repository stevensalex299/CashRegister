export interface Denomination {
  value: number;
  name: string;
}

export interface DenominationCount {
  denomination: Denomination;
  count: number;
}

export interface Currency {
  name: string;
  code: string;
  denominations: Denomination[];
}
