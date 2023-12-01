import { Model } from "mongoose";

export type IItem = {
  Id: string;
  Name: string;
  created_by: string;
};
export type IItemFilters = {
  searchTerm?: string;
  Name?: string;
  Id?: string;
  created_by?: string;
};
