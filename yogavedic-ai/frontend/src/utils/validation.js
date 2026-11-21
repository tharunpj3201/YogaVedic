// Shared form validation — YogaVedic
// Used by OnboardingPage and ProfilePage so both flows enforce the same
// realistic, human-readable rules with clear error messages.

export function validateEmail(email) {
  const trimmed = (email || '').trim()
  if (!trimmed) return 'Please enter your email.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Please enter a valid email address.'
  return null
}

export function validatePassword(password) {
  if (!password) return 'Please enter a password.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  return null
}

export function validateLoginForm(form) {
  const errors = {}
  const emailErr = validateEmail(form.email)
  if (emailErr) errors.email = emailErr
  if (!form.password) errors.password = 'Please enter your password.'
  return errors
}

export function validateRegisterForm(form) {
  const errors = {}
  const nameErr = validateName(form.name)
  if (nameErr) errors.name = nameErr
  const emailErr = validateEmail(form.email)
  if (emailErr) errors.email = emailErr
  const passErr = validatePassword(form.password)
  if (passErr) errors.password = passErr
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.'
  return errors
}

export function validateName(name) {
  const trimmed = (name || '').trim()
  if (!trimmed) return 'Please enter your name.'
  if (trimmed.length > 40) return 'Name must be under 40 characters.'
  if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return "Name can only contain letters, spaces, and . ' -"
  return null
}

export function validateAge(age) {
  if (age === '' || age === null || age === undefined) return 'Please enter your age.'
  const n = Number(age)
  if (!Number.isFinite(n)) return 'Age must be a number.'
  if (!Number.isInteger(n)) return 'Age must be a whole number.'
  if (n < 10 || n > 100) return 'Age must be between 10 and 100.'
  return null
}

export function validateGender(gender) {
  if (!gender) return 'Please select an option.'
  return null
}

export function validateWeight(weight, { required = false } = {}) {
  if (weight === '' || weight === null || weight === undefined) {
    return required ? 'Please enter your weight.' : null
  }
  const n = Number(weight)
  if (!Number.isFinite(n)) return 'Weight must be a number.'
  if (n < 20 || n > 300) return 'Weight must be between 20 and 300 kg.'
  return null
}

export function validateHeight(height, { required = false } = {}) {
  if (height === '' || height === null || height === undefined) {
    return required ? 'Please enter your height.' : null
  }
  const n = Number(height)
  if (!Number.isFinite(n)) return 'Height must be a number.'
  if (n < 100 || n > 250) return 'Height must be between 100 and 250 cm.'
  return null
}

export function validateGoal(goal) {
  if (!goal) return null // optional field
  if (goal.trim().length > 300) return 'Please keep your goal under 300 characters.'
  return null
}

// Runs all field validators relevant to a given onboarding step and returns
// an { fieldKey: errorMessage } map (only invalid fields are included).
export function validateOnboardingStep(step, form) {
  const errors = {}
  if (step === 0) {
    const e = validateName(form.name)
    if (e) errors.name = e
  }
  if (step === 1) {
    const ageErr = validateAge(form.age)
    if (ageErr) errors.age = ageErr
    const genderErr = validateGender(form.gender)
    if (genderErr) errors.gender = genderErr
    const weightErr = validateWeight(form.weight)
    if (weightErr) errors.weight = weightErr
    const heightErr = validateHeight(form.height)
    if (heightErr) errors.height = heightErr
  }
  if (step === 4) {
    const goalErr = validateGoal(form.goal)
    if (goalErr) errors.goal = goalErr
  }
  return errors
}

export function validateProfileForm(form) {
  const errors = {}
  const nameErr = validateName(form.name)
  if (nameErr) errors.name = nameErr
  const ageErr = validateAge(form.age)
  if (ageErr) errors.age = ageErr
  const weightErr = validateWeight(form.weight)
  if (weightErr) errors.weight = weightErr
  const heightErr = validateHeight(form.height)
  if (heightErr) errors.height = heightErr
  return errors
}
