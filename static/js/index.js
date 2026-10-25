'use strict';

// This page has no carousel, video SDK, or jQuery dependencies.
const copyButton = document.querySelector('.copy-bibtex-btn');
const bibtex = document.getElementById('bibtex-code');
const copyStatus = document.querySelector('.copy-status');

if (copyButton && bibtex && copyStatus) {
  let resetTimer;

  copyButton.addEventListener('click', async () => {
    clearTimeout(resetTimer);
    const label = copyButton.querySelector('.copy-text');

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(bibtex.textContent);
      } else {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(bibtex);
        selection.removeAllRanges();
        selection.addRange(range);
        const copied = document.execCommand('copy');
        if (!copied) throw new Error('Clipboard copy was unavailable.');
        selection.removeAllRanges();
      }

      copyButton.classList.add('copied');
      label.textContent = 'Copied!';
      copyStatus.textContent = 'BibTeX copied to clipboard.';
      resetTimer = setTimeout(() => {
        copyButton.classList.remove('copied');
        label.textContent = 'Copy';
        copyStatus.textContent = '';
      }, 2500);
    } catch (error) {
      copyButton.classList.remove('copied');
      label.textContent = 'Copy';
      copyStatus.textContent = 'Please select and copy the citation below.';
      const range = document.createRange();
      range.selectNodeContents(bibtex);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      console.warn('BibTeX copy failed; the citation was selected for manual copying.', error);
    }
  });
}
