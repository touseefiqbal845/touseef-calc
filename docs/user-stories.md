# User stories

## Proposed calculation rules

- All amounts are in PKR. Each course fee, the optional registration fee, and the optional budget accept Rs 0 through Rs 10,000,000 inclusive, with up to two decimal places. Scholarship accepts 0 through 100 percent inclusive, with up to two decimal places.
- A plan supports up to 20 courses. Each course requires a name of 1–80 characters after trimming and a fee. Blank registration and scholarship default to zero. Blank budget disables comparison, while an explicit zero budget is compared.
- Convert amounts to integer paisa. Sum tuition first. Apply the scholarship to tuition only and round the deduction once to the nearest paisa, with half a paisa rounded up. The amount due is tuition minus the deduction plus registration. Budget status is determined from budget minus amount due.
- Reject negative numbers, excess decimal places, exponent notation, and nonnumeric entries. Invalid course names or fees block the estimate. Invalid registration or scholarship blocks the amount due and comparison. Invalid budget blocks only the comparison. An empty course list shows an empty state with no estimate.

## S-1 · Estimate term fees (J-1)

**Status:** Implemented

As a student, I want to see the itemized amount due so I can plan my payment.

- Given Math costs Rs 12,000 and Computer Science costs Rs 15,000, when I enter a 10% scholarship and Rs 2,000 registration, then I see Rs 27,000 tuition, Rs 2,700 scholarship, Rs 2,000 registration, and Rs 26,300 due.
- Given Rs 27,000 tuition and Rs 2,000 registration, when I apply a 100% scholarship, then Rs 2,000 remains due.
- Given a course costs Rs 0.01, when I apply a 50% scholarship, then the displayed deduction is Rs 0.01 and the amount due is Rs 0.00.
- Given 20 courses each costing Rs 10,000,000 and no optional charges or deductions, when I view the estimate, then tuition and amount due both equal Rs 200,000,000.
- Given a valid plan, when I replace a fee with a negative amount, an amount above the cap, or Rs 0.001, then I see an inline error and no amount due. When I correct the fee to zero, then the error clears and the estimate updates.
- Given no courses, when I open the planner or remove the last course, then I see an empty state and no estimate.

## S-2 · Compare and revise course choices (J-2)

**Status:** Implemented

As a student, I want to compare the cost of my current selection with my budget so I can revise my choices.

- Given an amount due of Rs 26,300, when I enter budgets of Rs 25,000, Rs 26,300, and Rs 30,000 in turn, then I see Rs 1,300 over, exactly on budget, and Rs 3,700 under, respectively.
- Given Rs 26,300 due, when I leave the budget blank, then the total remains visible without a comparison. When I enter zero, then I see Rs 26,300 over budget.
- Given a valid estimate, when I enter an invalid budget, then an inline budget error replaces the comparison and the estimate stays visible. When I correct the budget, then the comparison returns.
- Given the example plan and a Rs 25,000 budget, when I remove Computer Science, then the amount due updates to Rs 12,800 and the comparison to Rs 12,200 under budget.
- Given 20 courses, when I reach the course limit, then the add action is unavailable and the planner explains the limit. When I remove a course, then I can add one again.

## S-3 · Resume or clear a draft (J-3)

**Status:** Implemented

As a student, I want to resume my term plan on the same browser so I can keep comparing my choices later.

- Given a saved draft, when I reload in the same browser, then the courses and optional inputs are restored and the estimate is recalculated.
- Given a saved draft, when I clear it and reload, then I see an empty planner.
- Given storage is unavailable or the saved data is malformed or has an unsupported version, when I open the app, then I can start a fresh plan and calculate fees without a crash.

