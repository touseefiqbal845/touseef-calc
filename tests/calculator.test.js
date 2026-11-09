import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, EMPTY, restore } from '../src/calculator.js';

const course = (name, fee) => ({ name, fee });
const sample = { courses: [course('Math', '12000'), course('Computer Science', '15000')], scholarship: '10', registration: '2000', budget: '25000' };

test('itemizes fees and updates the budget after removing a course', () => {
  const { tuition, deduction, registration, due, difference } = calculate(sample);
  assert.deepEqual([tuition, deduction, registration, due, difference], [2700000, 270000, 200000, 2630000, -130000]);
  assert.equal(calculate({ ...sample, courses: sample.courses.slice(0, 1) }).difference, 1220000);
});

test('distinguishes blank, zero, exact, surplus and invalid budgets', () => {
  for (const [budget, expected] of [['', undefined], ['0', -2630000], ['26300', 0], ['30000', 370000], ['-1', undefined]]) {
    const result = calculate({ ...sample, budget });
    assert.equal(result.difference, expected);
    assert.equal(result.due, 2630000);
    assert.equal(Boolean(result.errors.budget), budget === '-1');
  }
});

test('handles maximum tuition, fractional paisa rounding, and full scholarships', () => {
  assert.equal(calculate({ ...sample, scholarship: '100' }).due, 200000);
  assert.equal(calculate({ ...EMPTY, courses: [course('Math', '0.01')], scholarship: '50' }).deduction, 1);
  assert.equal(calculate({ ...EMPTY, courses: Array.from({ length: 20 }, () => course('Math', '10000000')) }).due, 20000000000);
});

test('suppresses invalid totals and recovers with a valid zero fee', () => {
  assert.equal(calculate(EMPTY).due, undefined);
  for (const fee of ['-1', '10000001', '0.001', '1e2', 'abc', '']) {
    const result = calculate({ ...EMPTY, courses: [course('Math', fee)] });
    assert.ok(result.courseErrors[0].fee);
    assert.equal(result.due, undefined);
  }
  assert.equal(calculate({ ...EMPTY, courses: [course('Math', '0')] }).due, 0);
  assert.equal(calculate({ ...sample, scholarship: '100.01' }).due, undefined);
  assert.equal(calculate({ ...sample, registration: '-1' }).due, undefined);
});

test('restores a valid draft and falls back safely', () => {
  const load = value => restore(() => ({ getItem: () => value }));
  assert.equal(calculate(load(JSON.stringify({ version: 1, plan: sample }))).due, 2630000);
  assert.equal(load('{'), EMPTY);
  assert.equal(load(JSON.stringify({ version: 2, plan: sample })), EMPTY);
  assert.equal(restore(() => { throw new Error('Blocked'); }), EMPTY);
});
