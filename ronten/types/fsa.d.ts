export declare type FluxType = string;
export interface FSA<Payload = void> {
  readonly type: FluxType;
  payload: Payload;
  error?: boolean;
  meta?: any;
}
