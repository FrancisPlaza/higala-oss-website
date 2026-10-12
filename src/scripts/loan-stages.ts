export {};

const journey = document.querySelector<HTMLElement>('[data-loan-journey]');

if (journey) {
  const controls = journey.querySelector<HTMLElement>('.stage-controls');
  const summary = journey.querySelector<HTMLElement>('[data-stage-summary]');
  const panels = [...journey.querySelectorAll<HTMLElement>('[data-stage-panel]')];
  const descriptions: Record<string, string> = {
    request: 'Mara Santos requests ₱12,000 from Sulong Cooperative. This illustrative request is ready for staff review.',
    review: 'Iris Reyes prepares loan L-024 and Nico Cruz reviews it. The open reference engine splits ₱12,000 into three equal ₱4,000 principal components.',
    disburse: 'Illustrative disbursement: debit loan receivable ₱12,000 and credit customer deposits ₱12,000. The paired entries balance.',
    repay: 'After the first ₱4,000 principal payment, ₱8,000 remains. The ledger records debit customer deposits and credit loan receivable for ₱4,000.',
  };

  journey.querySelectorAll<HTMLButtonElement>('[data-stage-control]').forEach((button) => {
    button.addEventListener('click', () => {
      const stage = button.dataset.stageControl;
      if (!stage || !descriptions[stage]) return;

      journey.dataset.stage = stage;
      journey.querySelectorAll<HTMLButtonElement>('[data-stage-control]').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      for (const panel of panels) panel.hidden = panel.dataset.stagePanel !== stage;
      if (summary) summary.textContent = descriptions[stage]!;
    });
  });

  controls?.removeAttribute('hidden');
  journey.dataset.enhanced = 'true';
}
