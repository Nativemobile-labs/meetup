import { PaymentTypeModel } from "../types";
import { api } from "./api";

export const fetchPaymentTypes = async (): Promise<PaymentTypeModel[]> => {
  const data = await api.serverAuth.get<{ payment_types: PaymentTypeModel[] }>(
    "/api/v1/payment-types",
  );
  return data.payment_types;
};
