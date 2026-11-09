import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { calculate, EMPTY, MAX_COURSES, restore, STORAGE_KEY } from './calculator.js';
import './style.css';

const money = new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const format = units => units === undefined ? '—' : `Rs ${money.format(units / 100)}`;

function Field({ id, label, value, onChange, error, placeholder, numeric }) {
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    <input id={id} value={value} onChange={event => onChange(event.target.value)}
      inputMode={numeric ? 'decimal' : undefined} maxLength={100} placeholder={placeholder}
      aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} />
    {error && <small className="error" id={`${id}-error`}>{error}</small>}
  </div>;
}

const Course = memo(function Course({ row, index, nameError, feeError, update, remove }) {
  return <li className="course">
    <Field id={`${row.id}-name`} label={`Course ${index + 1} name`} placeholder="e.g. Mathematics" value={row.name}
      onChange={value => update(row.id, 'name', value)} error={nameError} />
    <Field id={`${row.id}-fee`} label="Fee (PKR)" placeholder="0.00" value={row.fee}
      onChange={value => update(row.id, 'fee', value)} error={feeError} numeric />
    <button className="remove" aria-label={`Remove course ${index + 1}`} onClick={() => remove(row.id)}>×</button>
  </li>;
});

const catalog = [
  { name: 'Mathematics', fee: '12000' },
  { name: 'Computer Science', fee: '15000' },
  { name: 'English Composition', fee: '10000' },
  { name: 'Business Fundamentals', fee: '13500' },
  { name: 'Graphic Design', fee: '14500' },
];

const options = [
  ['registration', 'Registration (PKR)', '0.00'],
  ['scholarship', 'Scholarship (%)', '0'],
  ['budget', 'Term budget (PKR)', 'Optional'],
];

function App() {
  const [plan, setPlan] = useState(() => restore(() => window.localStorage));
  const [saveStatus, setSaveStatus] = useState('');
  const result = useMemo(() => calculate(plan), [plan]);
  const update = useCallback((id, key, value) => {
    setPlan(current => ({ ...current, courses: current.courses.map(row => row.id === id ? { ...row, [key]: value } : row) }));
  }, []);
  const remove = useCallback(id => {
    setPlan(current => ({ ...current, courses: current.courses.filter(row => row.id !== id) }));
  }, []);
  useEffect(() => {
    try {
      if (plan === EMPTY) window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, plan }));
      setSaveStatus(plan === EMPTY ? 'Drafts stay on this browser' : 'Draft saved on this browser');
    } catch {
      setSaveStatus('Draft storage is unavailable');
    }
  }, [plan]);

  function addCourse(course = { name: '', fee: '' }) {
    const row = { id: crypto.randomUUID(), ...course };
    setPlan(current => current.courses.length < MAX_COURSES ? { ...current, courses: [...current.courses, row] } : current);
  }

  const { tuition, deduction, registration, due, difference } = result;
  return <>
    <header><div className="shell brand"><span className="mark" aria-hidden="true">T</span><strong>Termfolio</strong><span className="brand-tag">STUDENT TOOLS</span></div></header>
    <main className="shell">
      <section className="hero"><p className="eyebrow">ENROLLMENT PLANNING</p><h1>Plan your next term.</h1><p>Build your course list and see what you’ll pay before you enroll.</p></section>
      <div className="layout">
        <section className="panel" aria-labelledby="courses-heading">
          <div className="heading"><div><p className="eyebrow">01 / YOUR PLAN</p><h2 id="courses-heading">Course planner</h2></div><span className="count">{plan.courses.length} / {MAX_COURSES} courses</span></div>
          {plan.courses.length ? <ol className="courses">{plan.courses.map((row, index) => <Course key={row.id} row={row} index={index}
            nameError={result.courseErrors[index].name} feeError={result.courseErrors[index].fee} update={update} remove={remove} />)}</ol>
            : <div className="empty">No courses yet. Add your first course to start an estimate.</div>}
          <div className="catalog">
            <label htmlFor="catalog">Add from sample courses</label>
            <select id="catalog" value="" disabled={plan.courses.length >= MAX_COURSES}
              aria-describedby="catalog-hint" onChange={event => {
                if (event.target.value !== '') addCourse(catalog[Number(event.target.value)]);
              }}>
              <option value="">Choose a course</option>
              {catalog.map((course, index) => <option key={course.name} value={index}>
                {course.name} · {format(Number(course.fee) * 100)}
              </option>)}
            </select>
            <p id="catalog-hint" className="muted">Sample fees are editable.</p>
          </div>
          <button className="add" disabled={plan.courses.length >= MAX_COURSES} onClick={() => addCourse()}>＋ Add course</button>
          {plan.courses.length === MAX_COURSES && <p className="muted">This plan has reached the 20-course limit.</p>}
          <div className="extras"><h3>Fees and funding</h3><p className="muted">All three fields are optional. Scholarships apply to tuition.</p>
            <div className="option-grid">{options.map(([key, label, placeholder]) => <Field key={key} id={key} label={label} value={plan[key]}
              placeholder={placeholder} error={result.errors[key]} numeric onChange={value => setPlan(current => ({ ...current, [key]: value }))} />)}</div>
          </div>
          <footer><small>{saveStatus}</small><button className="clear" disabled={plan === EMPTY} onClick={() => setPlan(EMPTY)}>Clear draft</button></footer>
        </section>
        <aside className="summary" aria-labelledby="summary-heading">
          <p className="eyebrow">02 / FEE ESTIMATE</p><h2 id="summary-heading">Term summary</h2>
          <dl><div><dt>Tuition subtotal</dt><dd>{format(tuition)}</dd></div>
            <div><dt>Scholarship deduction</dt><dd>{deduction > 0 ? '−' : ''}{format(deduction)}</dd></div>
            <div><dt>Registration fee</dt><dd>{format(tuition === undefined ? undefined : registration)}</dd></div></dl>
          <div aria-live="polite"><p className="total-label">TOTAL DUE · PKR</p><p className="total">{format(due)}</p>
            <p className="budget" data-status={difference < 0 ? 'over' : 'neutral'}>
              {difference === undefined ? (due === undefined ? 'Complete your course details for an estimate.' : result.errors.budget ? 'Correct the budget to see your comparison.' : 'Enter a budget to compare your costs.')
                : difference === 0 ? 'Exactly on budget' : `${format(Math.abs(difference))} ${difference < 0 ? 'over' : 'under'} budget`}
            </p></div>
        </aside>
      </div>
    </main>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);


