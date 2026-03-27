/**
 * technicianService.js
 *
 * Business logic layer for technicians.
 */
import { technicianApi } from '../api'

export const fetchTechnicians          = (params) => technicianApi.getTechnicians(params)
export const fetchTechnicianById       = (id)     => technicianApi.getTechnicianById(id)
export const fetchTechnicianReviews    = (id)     => technicianApi.getTechnicianReviews(id)
export const fetchAvailableTechnicians = (service) => technicianApi.getAvailableTechnicians(service)
