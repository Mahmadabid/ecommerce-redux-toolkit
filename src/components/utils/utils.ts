import { v4 as uuidv4 } from "uuid";

export const generateRandomId = () => {
  const id = uuidv4;
  return id;
};

export enum Role {
  buyer = "buyer",
  seller = "seller",
  admin = "admin",
}
