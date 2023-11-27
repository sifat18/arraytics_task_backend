import { Model } from "mongoose";

export type IItem = {
  Id: string;
  Name: string;
  created_by: string;
};
export type IItemFilters = {
  searchTerm?: string;
  email?: string;
  name?: string;
  Id?: string;
  created_by?: string;
};
