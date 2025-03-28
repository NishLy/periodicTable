interface AtomicElement {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: string;
  electronicConfiguration: string;
  electronegativity: number;
  atomicRadius: number;
  ionRadius: string;
  vanDerWaalsRadius: number;
  ionizationEnergy: number;
  electronAffinity: number;
  oxidationStates: string;
  standardState: string;
  bondingType: string;
  meltingPoint: number;
  boilingPoint: number;
  density: number;
  yearDiscovered: number;
  block: string;
  cpkHexColor: string;
  period: number;
  group: number;
  class: string;
  style: string;
  groupBlock: string;
  [key: string]: any;
}

export default AtomicElement;
