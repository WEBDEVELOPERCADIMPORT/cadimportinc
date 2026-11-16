import { getReviews } from "./reviews/getReviews.action";
import { getDepartments } from "./departments/getDepartments.action";
import { getDepartmentBySlug } from "./departments/getDepartmentBySlug.action";
import { getBrands } from "./brands/getBrands.action";
import { getBrandBySlug } from "./brands/getBrandBySlug.action";
import { getProductsByBrand } from "./products/getProductsByBrand.action";
import { submitContact } from "./contact/submitContact.action";
import { subscribeNewsletter } from "./newsletter/subscribeNewsletter.action";
import { getEmployees } from "./employees/getEmployees.action";
import { getEmployeeBySlug } from "./employees/getEmployeeBySlug.action";

export const server = {
  // Reviews
  getReviews,

  // Departments
  getDepartments,
  getDepartmentBySlug,

  // Brands
  getBrands,
  getBrandBySlug,

  // Products
  getProductsByBrand,

  // Employees / Digital Business Cards
  getEmployees,
  getEmployeeBySlug,

  // Forms
  submitContact,
  subscribeNewsletter,
};
