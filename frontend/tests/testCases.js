// This file contains the final, stable suite of test cases.
// All prompts are written in a direct, "row by row" format to ensure predictable results.
window.testCases = [
    // TC 1: Simple Vertical List
    {
        name: "TC 1: Simple Vertical List",
        prompt: `Contact form: name, email, message textarea, submit button`,
        expectedConfig: {
            "rows": [
                {
                    "type": "input",
                    "name": "name",
                    "label": "Name",
                    "labelPosition": "top"
                },
                {
                    "type": "input",
                    "name": "email",
                    "label": "Email",
                    "labelPosition": "top"
                },
                {
                    "type": "textarea",
                    "name": "message",
                    "label": "Message",
                    "labelPosition": "top",
                    "placeholder": "Type your message here"
                },
                {
                    "type": "button",
                    "name": "submit",
                    "text": "Submit",
                    "submit": true
                }
            ]
        }
    },
    // TC 2: Grid (1 Row, 2 Cols)
    {
        name: "TC 2: Grid (1 Row, 2 Cols)",
        prompt: `row 1: input, selectbox`,
        expectedConfig: {
            "rows": [
                {
                    "cols": [
                        { "width": "48%", "type": "input", "name": "input1", "label": "Input", "labelPosition": "top" },
                        { "type": "spacer" },
                        { "width": "48%", "type": "select", "name": "selectbox1", "label": "Selectbox", "labelPosition": "top", "options": [{ "value": "1", "content": "Option 1" }] }
                    ]
                }
            ]
        }
    },
    // TC 3: Grid (1 Row, 3 Cols)
    {
        name: "TC 3: Grid (1 Row, 3 Cols)",
        prompt: `row 1: input, datepicker, timepicker`,
        expectedConfig: {
            "rows": [
                {
                    "cols": [
                        { "width": "32%", "type": "input", "name": "input1", "label": "Input", "labelPosition": "top" },
                        { "type": "spacer" },
                        { "width": "32%", "type": "datepicker", "name": "datepicker1", "label": "Datepicker", "labelPosition": "top" },
                        { "type": "spacer" },
                        { "width": "32%", "type": "timepicker", "name": "timepicker1", "label": "Timepicker", "labelPosition": "top" }
                    ]
                }
            ]
        }
    },
    // TC 4: Multiple Grid Rows
    {
        name: "TC 4: Multiple Grid Rows",
        prompt: `row 1: input, selectbox\nrow 2: datepicker, timepicker`,
        expectedConfig: {
            "rows": [
                {
                    "cols": [
                        { "width": "48%", "type": "input", "name": "input1", "label": "Input", "labelPosition": "top" },
                        { "type": "spacer" },
                        { "width": "48%", "type": "select", "name": "selectbox1", "label": "Selectbox", "labelPosition": "top", "options": [{ "value": "1", "content": "Option 1" }] }
                    ]
                },
                {
                    "cols": [
                        { "width": "48%", "type": "datepicker", "name": "datepicker1", "label": "Datepicker", "labelPosition": "top" },
                        { "type": "spacer" },
                        { "width": "48%", "type": "timepicker", "name": "timepicker1", "label": "Timepicker", "labelPosition": "top" }
                    ]
                }
            ]
        }
    },
    // TC 5: Mixed (Grid then Simple)
    {
        name: "TC 5: Mixed (Grid then Simple)",
        prompt: `row 1: input, selectbox\nrow 2: combo`,
        expectedConfig: {
            "rows": [
                {
                    "cols": [
                        { "width": "48%", "type": "input", "name": "input1", "label": "Input", "labelPosition": "top" },
                        { "type": "spacer" },
                        { "width": "48%", "type": "select", "name": "selectbox1", "label": "Selectbox", "labelPosition": "top", "options": [{ "value": "1", "content": "Option 1" }] }
                    ]
                },
                { "type": "combo", "name": "combo1", "label": "Combo", "labelPosition": "top", "data": [{ "id": "1", "value": "Option 1" }] }
            ]
        }
    },
    // TC 6: Complex Mixed
    {
        name: "TC 6: Complex Mixed",
        prompt: `row 1: input, selectbox\nrow 2: combo\nrow 3: datepicker, timepicker\nrow 4: textarea\nrow 5: submit button`,
        expectedConfig: {
            "rows": [
                {
                    "cols": [
                        { "width": "48%", "type": "input", "name": "input1", "label": "Input", "labelPosition": "top" },
                        { "type": "spacer" },
                        { "width": "48%", "type": "select", "name": "selectbox1", "label": "Selectbox", "labelPosition": "top", "options": [{ "value": "1", "content": "Option 1" }] }
                    ]
                },
                { "type": "combo", "name": "combo1", "label": "Combo", "labelPosition": "top", "data": [{ "id": "1", "value": "Option 1" }] },
                {
                    "cols": [
                        { "width": "48%", "type": "datepicker", "name": "datepicker1", "label": "Datepicker", "labelPosition": "top" },
                        { "type": "spacer" },
                        { "width": "48%", "type": "timepicker", "name": "timepicker1", "label": "Timepicker", "labelPosition": "top" }
                    ]
                },
                { "type": "textarea", "name": "textarea1", "label": "Textarea", "labelPosition": "top" },
                { "type": "button", "name": "submit", "text": "Submit", "submit": true }
            ]
        }
    }
];