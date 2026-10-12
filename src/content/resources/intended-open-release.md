---
title: The intended open release
description: A concise view of the components Higala intends to make open and the boundaries that still need to be clear.
category: Project scope
order: 1
audience: Both
---

This guide describes Higala's intended open scope; it is not a downloadable release. The planned platform connects a ledger, staff workspace, usable open reference loan engine, and customer starter for rural banks, cooperatives, and developers.

## Components in the intended scope

- **Ledger:** double-entry records for internal money movement.
- **Staff workspace:** a place for staff to prepare and review banking activity.
- **Reference loan engine:** a usable open engine for a principal schedule.
- **Customer starter:** a mobile starting point that an institution can adapt.

The commercial loan engine is an optional extension. The open release does not require it. Talino also offers optional implementation, hosting, and support services; those services, hosting, and migration can carry separate costs.

## Boundaries

The initial core focuses on internal, closed-loop activity. Payment rails and institution-specific integrations require separate evaluation.

Any institution evaluating the project should check its integrations, controls, migration needs, operating responsibilities, and regulatory obligations against its own requirements.

## Illustrative lending example

Mara Santos requests ₱12,000 from Sulong Cooperative. The reference schedule has three equal ₱4,000 principal components. Disbursement records a debit to loan receivable and a credit to customer deposits for ₱12,000. After the first principal payment, ₱8,000 remains; repayment records a debit to customer deposits and a credit to loan receivable for ₱4,000.

This illustration models principal only. It has no interest or fee calculation.
