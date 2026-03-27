/**
 * serviceService.js
 *
 * Business logic layer for the service catalogue.
 */
import { serviceApi } from '../api'

export const fetchServices    = (params) => serviceApi.getServices(params)
export const fetchServiceById = (id)     => serviceApi.getServiceById(id)
export const fetchCategories  = ()       => serviceApi.getCategories()
