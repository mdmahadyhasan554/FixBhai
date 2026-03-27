import { useState, useCallback } from 'react'

/**
 * Generic form hook.
 * @param {object} initialValues
 * @param {object} validationRules  - { fieldName: (value) => errorString }
 */
const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues]   = useState(initialValues)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const setValue = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }))
    // Clear error on change
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }, [errors])

  const handleChange = useCallback((e) => {
    setValue(e.target.name, e.target.value)
  }, [setValue])

  const validateAll = useCallback(() => {
    const newErrors = {}
    let valid = true
    Object.entries(validationRules).forEach(([field, fn]) => {
      const err = fn(values[field])
      if (err) { newErrors[field] = err; valid = false }
    })
    setErrors(newErrors)
    return valid
  }, [values, validationRules])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  return { values, errors, loading, setLoading, setValue, handleChange, validateAll, reset }
}

export default useForm
