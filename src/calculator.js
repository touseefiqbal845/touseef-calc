export const MAX_COURSES = 20;
export const EMPTY = { courses: [], registration: '', scholarship: '', budget: '' };
export const STORAGE_KEY = 'termfolio.plan.v1';

function parseDecimal(raw, limit, label, optional = false) {
  const value = raw.trim();
  if (!value && optional) return { units: 0 };
  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    return { error: `Enter ${label} with up to two decimal places.` };
  }
  const [whole, fraction = ''] = value.split('.');
  const units = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return units <= limit * 100 ? { units } : { error: `Maximum ${label} is ${limit.toLocaleString('en-PK')}.` };
}

export function calculate(plan) {
  const courseErrors = plan.courses.map(({ name, fee }) => ({
    name: name.trim().length >= 1 && name.trim().length <= 80 ? undefined : 'Enter a course name of 1–80 characters.',
    fee: parseDecimal(fee, 10_000_000, 'course fee').error,
  }));
  const registration = parseDecimal(plan.registration, 10_000_000, 'registration fee', true);
  const scholarship = parseDecimal(plan.scholarship, 100, 'scholarship percentage', true);
  const budget = parseDecimal(plan.budget, 10_000_000, 'budget', true);
  const errors = { registration: registration.error, scholarship: scholarship.error, budget: budget.error };
  if (!plan.courses.length || courseErrors.some(({ name, fee }) => name || fee)) return { courseErrors, errors };
  const tuition = plan.courses.reduce((sum, { fee }) => sum + parseDecimal(fee, 10_000_000, 'course fee').units, 0);
  const deduction = scholarship.error ? undefined : Math.floor((tuition * scholarship.units + 5000) / 10000);
  const due = registration.error || scholarship.error ? undefined : tuition - deduction + registration.units;
  const difference = due === undefined || budget.error || !plan.budget.trim() ? undefined : budget.units - due;
  return { courseErrors, errors, tuition, deduction, registration: registration.units, due, difference };
}

export function restore(storage) {
  try {
    const saved = JSON.parse(storage().getItem(STORAGE_KEY));
    const isText = value => typeof value === 'string' && value.length <= 100;
    if (saved?.version !== 1 || !Array.isArray(saved.plan?.courses)) return EMPTY;
    const { courses, registration, scholarship, budget } = saved.plan;
    if (courses.length > MAX_COURSES || ![registration, scholarship, budget].every(isText)) return EMPTY;
    if (!courses.every(row => row && [row.name, row.fee].every(isText))) return EMPTY;
    return { registration, scholarship, budget, courses: courses.map(({ name, fee }) => ({ id: crypto.randomUUID(), name, fee })) };
  } catch {
    return EMPTY;
  }
}

