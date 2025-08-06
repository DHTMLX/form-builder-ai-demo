// This file contains all the logic for the Debug Mode Test Suite.
// It activates on "?debug=true", hides the main app, and runs all tests automatically.

(function () {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') !== 'true') {
        return; // Exit immediately if not in debug mode
    }

    // Instantly hide the main app to prevent flashing content
    const style = document.createElement('style');
    style.innerHTML = `.main-container, .dhx_demo-footer { display: none !important; } body { background-color: #f0f2f5; }`;
    document.head.appendChild(style);

    document.addEventListener("DOMContentLoaded", function () {
        // Create an independent socket connection for the test runner
        const socket = io();
        socket.on('connect', () => {
            console.log("Debug runner connected to the server successfully!");
        });

        // Create the test runner UI
        const reportContainer = document.createElement('div');
        reportContainer.className = 'debug-report-container';

        const controlsContainer = document.createElement('div');
        const runButton = document.createElement('button');
        runButton.id = 'run-all-tests-btn';
        runButton.textContent = 'Run All Test Cases';

        const copyButton = document.createElement('button');
        copyButton.id = 'copy-results-btn';
        copyButton.textContent = 'Copy All Results';
        copyButton.style.marginLeft = '10px';
        copyButton.disabled = true;

        controlsContainer.appendChild(runButton);
        controlsContainer.appendChild(copyButton);
        document.body.insertBefore(controlsContainer, document.body.firstChild);
        document.body.appendChild(reportContainer);

        let fullReportText = '';

        function waitForMonaco() {
            return new Promise(resolve => {
                function check() {
                    if (typeof window.monaco !== 'undefined' && window.monaco.editor) {
                        resolve();
                    } else {
                        setTimeout(check, 100);
                    }
                }
                check();
            });
        }

        runButton.addEventListener('click', runAllTests);

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(fullReportText).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => { copyButton.textContent = 'Copy All Results'; }, 2000);
            });
        });

        async function runAllTests() {
            await waitForMonaco();

            runButton.textContent = 'Running...';
            runButton.disabled = true;
            copyButton.disabled = true;
            reportContainer.innerHTML = '<h1>Test Results</h1>';

            const results = [];

            for (let i = 0; i < window.testCases.length; i++) {
                const testCase = window.testCases[i];
                const testCaseElement = createTestCaseMarkup(testCase, i);
                reportContainer.appendChild(testCaseElement);
                renderExpected(testCase, i);
                const generatedJsonString = await runSingleTest(socket, testCase, i);
                results.push(generateReportBlock(testCase, generatedJsonString));
            }

            fullReportText = results.join('\n');
            const summary = document.createElement('h2');
            summary.textContent = '--- ALL TESTS COMPLETED ---';
            reportContainer.appendChild(summary);
            runButton.textContent = 'Run All Test Cases Again';
            runButton.disabled = false;
            copyButton.disabled = false;
        }

        function generateReportBlock(testCase, generatedJsonString) {
            return `
========================================
--- TEST CASE: ${testCase.name} ---
========================================
PROMPT:
----------------------------------------
${testCase.prompt}
----------------------------------------
GENERATED JSON:
----------------------------------------
${generatedJsonString}
----------------------------------------
EXPECTED JSON:
----------------------------------------
${JSON.stringify(testCase.expectedConfig, null, 4)}
`;
        }

        function createTestCaseMarkup(testCase, index) {
            const element = document.createElement('div');
            element.className = 'test-case';
            element.id = `test-case-${index}`;
            element.innerHTML = `
                <h3>${testCase.name}</h3>
                <h4>Prompt:</h4>
                <pre class="prompt-display">${testCase.prompt}</pre>
                
                <h4>Form Preview Comparison</h4>
                <div class="comparison-container">
                    <div>
                        <h5>Generated Preview (Actual)</h5>
                        <div id="generated-preview-${index}" class="comparison-pane"></div>
                    </div>
                    <div>
                        <h5>Expected Preview (Ground Truth)</h5>
                        <div id="expected-preview-${index}" class="comparison-pane"></div>
                    </div>
                </div>
                
                <h4>JSON Configuration Comparison</h4>
                <div class="comparison-container">
                    <div>
                        <h5>Generated JSON (Actual)</h5>
                        <div id="generated-config-${index}" class="comparison-pane"></div>
                    </div>
                    <div>
                        <h5>Expected JSON (Ground Truth)</h5>
                        <div id="expected-config-${index}" class="comparison-pane"></div>
                    </div>
                </div>
            `;
            return element;
        }

        function renderExpected(testCase, index) {
            try {
                new dhx.Form(`expected-preview-${index}`, testCase.expectedConfig);
                monaco.editor.create(document.getElementById(`expected-config-${index}`), {
                    value: JSON.stringify(testCase.expectedConfig, null, 4),
                    language: 'json',
                    theme: 'vs-dark',
                    readOnly: true,
                    minimap: { enabled: false }
                });
            } catch (e) {
                document.getElementById(`expected-preview-${index}`).innerHTML = `<pre style="color:red;">Error in expectedConfig:\n${e.message}</pre>`;
            }
        }

        function runSingleTest(socketInstance, testCase, index) {
            return new Promise(resolve => {
                const testCaseElement = document.getElementById(`test-case-${index}`);
                const generatedConfigPane = document.getElementById(`generated-config-${index}`);
                const generatedPreviewPane = document.getElementById(`generated-preview-${index}`);

                generatedConfigPane.textContent = 'Running...';

                socketInstance.emit('generate_form', testCase.prompt, (response) => {
                    let isSuccess = false;
                    let generatedJsonString = '';

                    if (response.success) {
                        try {
                            const formConfig = JSON.parse(response.json);
                            generatedJsonString = JSON.stringify(formConfig, null, 4);
                            new dhx.Form(generatedPreviewPane, formConfig);
                            isSuccess = true;
                        } catch (e) {
                            generatedJsonString = `// RENDER ERROR: ${e.message}\n\n${response.json}`;
                            generatedPreviewPane.innerHTML = `<pre style="color:red;">Render Error:\n${e.message}</pre>`;
                        }
                    } else {
                        generatedJsonString = `// SERVER ERROR:\n${response.error}`;
                        generatedPreviewPane.innerHTML = `<pre style="color:red;">Server Error:\n${response.error}`;
                    }

                    monaco.editor.create(generatedConfigPane, {
                        value: generatedJsonString,
                        language: 'json',
                        theme: 'vs-dark',
                        readOnly: true,
                        minimap: { enabled: false }
                    });

                    testCaseElement.classList.add(isSuccess ? 'pass' : 'fail');
                    resolve(generatedJsonString);
                });
            });
        }
    });
})();