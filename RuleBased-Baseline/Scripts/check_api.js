const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

function resetForm() {
    document.getElementById('inputCode').value = "";
    document.getElementById('result').classList.add('hidden');
    document.getElementById('details').innerHTML = "";
}

function checkFormattingConsistency(code) {
    let lines = code.split('\n').map(line => line.trim());
    let indentations = lines.map(line => line.match(/^\s*/)[0].length);
    let uniqueIndentations = [...new Set(indentations)];
    return uniqueIndentations.length === 1;
}

function checkGenericVariableNames(code) {
    let genericNames = ['data', 'result', 'output', 'input', 'value', 'temp', 'item'];
    let regex = new RegExp(`\\b(${genericNames.join('|')})\\b`, 'g');
    return regex.test(code);
}

function checkLackOfComments(code) {
    let commentRegex = /\/\/|\/\*|\*/;
    return !commentRegex.test(code);
}

function checkRepetitivePatterns(code) {
    let lines = code.split('\n').map(line => line.trim());
    let uniqueLines = [...new Set(lines)];
    return uniqueLines.length / lines.length < 0.8; // More than 20% repetition
}

function checkStructuredPatterns(code) {
    let structuredRegex = /if\s*\(|for\s*\(|while\s*\(|switch\s*\(/g;
    let matches = code.match(structuredRegex);
    return matches && matches.length > 5; // Arbitrary threshold for simplicity
}

function checkComplexity(code) {
    let lineCount = code.split('\n').length;
    let uniqueKeywords = new Set(code.match(/\b(?:if|else|for|while|switch|return|function|const|let|var)\b/g));
    return uniqueKeywords.size > 10 && lineCount > 20; // Simple complexity metric
}

app.post('/analyze', (req, res) => {
    const code = req.body.code ? req.body.code.trim() : '';
    
    if (!code) {
        return res.status(400).json({ error: 'No code provided.' });
    }

    let score = 0;
    let totalCriteria = 6;
    let detailMessages = [];

    if (checkFormattingConsistency(code)) {
        score += 0.7;
        detailMessages.push("Consistent formatting detected (uniform indentation), which is often a trait of AI-generated code.");
    } else {
        detailMessages.push("Inconsistent formatting detected, which is more common in human-written code.");
    }

    if (checkGenericVariableNames(code)) {
        score += 1.7;
        detailMessages.push("Generic variable names like 'data', 'result', or 'input' found. AI often uses non-specific names.");
    } else {
        detailMessages.push("Specific, context-aware variable names detected, which is more typical of human-written code.");
    }

    if (checkLackOfComments(code)) {
        score += 1.3;
        detailMessages.push("No comments found in the code. AI-generated code often lacks comments.");
    } else {
        detailMessages.push("Comments found, indicating that the code might have been written or reviewed by a human.");
    }

    if (checkRepetitivePatterns(code)) {
        score += 1.7;
        detailMessages.push("Repetitive patterns found in the code, which can be a sign of AI generation.");
    } else {
        detailMessages.push("No significant repetitive patterns found, suggesting human involvement.");
    }

    if (checkStructuredPatterns(code)) {
        score += 1.1;
        detailMessages.push("Overly structured code detected (e.g., repeated if-else or loops), which might indicate AI involvement.");
    } else {
        detailMessages.push("Varied structure found in the code, which is often characteristic of human-written code.");
    }

    if (checkComplexity(code)) {
        score -= 1.0;
        detailMessages.push("High code complexity detected, which is usually a sign of human involvement.");
    } else {
        detailMessages.push("Simpler code detected, which could indicate AI generation.");
    }

    const percentage = (score / totalCriteria) * 100;
    const result = (percentage>=50)?"AI":"Human"
    res.json({
        evaluate: result,
        ai_generated_likelihood: `${percentage.toFixed(2)}`,
        details: detailMessages
    });
});

const PORT = 59875;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});