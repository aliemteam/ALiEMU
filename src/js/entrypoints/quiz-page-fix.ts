import domReady from '@wordpress/dom-ready';

function fixViewQuestionButtonName() {
    const button = document.querySelector<HTMLInputElement>(
        'input[name="reShowQuestion"]',
    );
    if (button) {
        button.value = 'Reveal answers';
    }
}

domReady(() => {
    fixViewQuestionButtonName();
});
