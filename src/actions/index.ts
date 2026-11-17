import { getReviews } from "./reviews/getReviews.action";
import { getDepartments } from "./departments/getDepartments.action";
import { getDepartmentBySlug } from "./departments/getDepartmentBySlug.action";
import { getBrands } from "./brands/getBrands.action";
import { getBrandBySlug } from "./brands/getBrandBySlug.action";
import { getProducts } from "./products/getProducts.action";
import { getProductsByBrand } from "./products/getProductsByBrand.action";
import { getProductById } from "./products/getProductById.action";
import { submitContact } from "./contact/submitContact.action";
import { subscribeNewsletter } from "./newsletter/subscribeNewsletter.action";
import { submitNewDistributor } from "./forms/submitNewDistributor.action";
import { submitLearnMore } from "./forms/submitLearnMore.action";
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
  getProducts,
  getProductsByBrand,
  getProductById,

  // Employees / Digital Business Cards
  getEmployees,
  getEmployeeBySlug,

  // Forms
  submitContact,
  subscribeNewsletter,
  submitNewDistributor,
  submitLearnMore,
};
