// Enhanced Learnosity/Connexus Educational Platform Script
// Streamlined version with custom alerts and auto-reveal

if (window.location.href.includes('prodpcx-cdn-vegaviewer.emssvc.connexus.com') || 
    window.location.href.includes('gaca.schoology.com')) {

    // ==================== SETUP & INITIALIZATION ====================
    
    // Load external dependencies
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css';
    fontAwesomeLink.crossOrigin = 'anonymous';
    
    const kateXLink = document.createElement('link');
    kateXLink.rel = 'stylesheet';
    kateXLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
    
    document.head.appendChild(fontAwesomeLink);
    document.head.appendChild(kateXLink);

    // Debug logging system
    const debugLogs = [];
    function addDebugLog(type, message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const log = { timestamp, type, message, data };
        debugLogs.push(log);
        
        const debugContent = document.querySelector('[data-content="debug"]');
        if (debugContent) {
            updateDebugDisplay();
        }
    }

    function updateDebugDisplay() {
        const debugContent = document.querySelector('[data-content="debug"]');
        if (!debugContent) return;
        
        const logsHTML = debugLogs.slice(-20).reverse().map(log => {
            const colorClass = {
                'error': 'color: #ef4444; font-weight: bold;',
                'warning': 'color: #f59e0b;',
                'success': 'color: #10b981; font-weight: bold;',
                'info': 'color: #3b82f6;'
            }[log.type] || '';
            
            return `<div style="margin-bottom: 8px; padding: 8px; background: #f9fafb; border-radius: 4px;">
                <span style="color: #6b7280; font-size: 0.75rem;">${log.timestamp}</span>
                <div style="${colorClass}">${log.message}</div>
                ${log.data ? `<pre style="font-size: 0.75rem; color: #6b7280; margin-top: 4px; overflow-x: auto;">${JSON.stringify(log.data, null, 2)}</pre>` : ''}
            </div>`;
        }).join('');
        
        debugContent.innerHTML = logsHTML || '<div style="color: #6b7280;">No logs yet...</div>';
    }

    // ==================== CUSTOM ALERT SYSTEM ====================
    
    function showCustomAlert(message, type = 'info', duration = 5000) {
        const alertContainer = document.createElement('div');
        
        const colors = {
            'success': { bg: '#10b981', border: '#059669' },
            'error': { bg: '#ef4444', border: '#dc2626' },
            'warning': { bg: '#f59e0b', border: '#d97706' },
            'info': { bg: '#3b82f6', border: '#2563eb' }
        };
        
        const color = colors[type] || colors.info;
        
        alertContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            background: ${color.bg};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            border-left: 4px solid ${color.border};
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            word-wrap: break-word;
            animation: slideInRight 0.3s ease-out;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 0.9rem;
            white-space: pre-line;
        `;
        
        alertContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">${message}</div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; font-size: 1.2rem; 
                               cursor: pointer; margin-left: 1rem; padding: 0; line-height: 1;">×</button>
            </div>
        `;
        
        document.body.appendChild(alertContainer);
        
        if (duration > 0) {
            setTimeout(() => {
                alertContainer.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => alertContainer.remove(), 300);
            }, duration);
        }
    }
    
    // Add animation styles
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(animationStyles);

    // ==================== STYLES ====================
    
    function createStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .modern-menu {
                position: fixed;
                top: 1rem;
                padding: 1rem;
                left: 1rem;
                z-index: 9999;
                font-family: system-ui, -apple-system, sans-serif;
                transform-origin: top left;
            }
            
            @media (max-width: 768px) {
                .modern-menu {
                    transform: scale(0.85);
                    top: 0.5rem;
                    left: 0.5rem;
                    padding: 0.5rem;
                }
            }
            
            @media (max-width: 480px) {
                .modern-menu {
                    transform: scale(0.7);
                    top: 0.25rem;
                    left: 0.25rem;
                }
            }
            
            .menu-button {
                background: #111827;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            .menu-button:hover {
                background: #1f2937;
                transform: scale(1.03);
            }
            .menu-container {
                display: none;
                background: white;
                border-radius: 0.75rem;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                margin-top: 0.75rem;
                width: 28rem;
                max-height: 80vh;
                overflow: hidden;
                flex-direction: column;
            }
            .tabs {
                display: flex;
                margin: 20px auto 0;
                border: 5px solid #f9f9f9;
                background: #f9f9f9;
                border-radius: 10px;
                width: 90%;
                flex-wrap: wrap;
            }
            .tab {
                flex: 1;
                min-width: 80px;
                padding: 0.75rem 0.5rem;
                background: none;
                border: none;
                cursor: pointer;
                font-weight: bold;
                color: #6b7280;
                transition: all 0.2s;
                border-bottom: 2px solid transparent;
                font-size: 0.85rem;
            }
            .tab.active {
                color: black;
                border-bottom-color: #3b82f6;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .tab:hover {
                color: #4b5563;
                transform: scale(1.05);
            }
            .tab-content {
                display: none;
                padding: 1rem;
                overflow-y: auto;
                max-height: 400px;
            }
            .tab-content.active {
                display: block;
            }
            .action-button {
                width: 91%;
                background: #111827;
                color: white;
                border: none;
                padding: 0.75rem 1rem;
                border-radius: 0.375rem;
                font-weight: 500;
                cursor: pointer;
                margin-bottom: 0.5rem;
                transition: all 0.2s;
                font-size: 0.875rem;
            }
            .action-button:hover {
                background: #1f2937;
                transform: scale(1.03);
            }
            .action-button:disabled {
                background: #6b7280;
                cursor: not-allowed;
                transform: none;
            }
            .chat-container {
                max-height: 15rem;
                overflow-y: auto;
                margin-bottom: 1rem;
            }
            .chat-message {
                padding: 0.75rem;
                border-radius: 0.5rem;
                margin-bottom: 0.5rem;
                word-wrap: break-word;
            }
            .user-message {
                background: #111827;
                color: white;
                margin-left: 2rem;
            }
            .assistant-message {
                background: #f3f4f6;
                margin-right: 2rem;
            }
            .input-container {
                display: flex;
                gap: 0.5rem;
            }
            .chat-input {
                flex: 1;
                padding: 0.75rem;
                border: 1px solid #e5e7eb;
                border-radius: 0.375rem;
                font-size: 0.875rem;
            }
            .chat-input:focus {
                outline: 2px solid #3b82f6;
                border-color: transparent;
            }
            #clear-logs {
                margin-top: 0.5rem;
                background: #ef4444;
            }
            #clear-logs:hover {
                background: #dc2626;
            }
            .match-pair {
                padding: 0.75rem;
                margin-bottom: 0.5rem;
                background: #f9fafb;
                border-left: 3px solid #3b82f6;
                border-radius: 0.375rem;
            }
            .match-label {
                display: inline-block;
                background: #e5e7eb;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                font-weight: bold;
                font-size: 0.75rem;
                margin-right: 0.5rem;
            }
            .match-arrow {
                color: #3b82f6;
                font-weight: bold;
                margin: 0 0.5rem;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // ==================== MENU STRUCTURE ====================
    
    function createMenuStructure() {
        const menu = document.createElement('div');
        menu.className = 'modern-menu';

        const menuButton = document.createElement('button');
        menuButton.className = 'menu-button';
        menuButton.textContent = 'Show Menu';
        menu.appendChild(menuButton);

        const menuContainer = document.createElement('div');
        menuContainer.className = 'menu-container';

        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'tabs';

        const tabsData = [
            '<i class="fa-solid fa-shield-dog"></i> cheats',
            '<i class="fa-regular fa-message"></i> response',
            '<i class="fa-solid fa-brain"></i> AI',
            '<i class="fa-solid fa-bug"></i> debug'
        ];
        
        tabsData.forEach((tabName, index) => {
            const tab = document.createElement('button');
            tab.className = `tab${index === 0 ? ' active' : ''}`;
            tab.setAttribute('data-tab', tabName);
            tab.innerHTML = tabName.charAt(0).toUpperCase() + tabName.slice(1);
            tabsContainer.appendChild(tab);
        });

        menuContainer.appendChild(tabsContainer);

        // Cheats tab - streamlined
        const cheatsContent = createTabContent('<i class="fa-solid fa-shield-dog"></i> cheats', true);
        const buttons = [
            { id: 'reveal-answer', text: '🎯 Reveal Answer', color: '#059669' },
            { id: 'auto-fill-answer', text: '⚡ Auto Fill Answer', color: '#dc2626' },
            { id: 'highlight-correct', text: '✨ Highlight Correct', color: '#f59e0b' },
            { id: 'show-hints', text: '🔍 Show Hints', color: '#14b8a6' },
            { id: 'explanation', text: '💡 Show Explanation', color: '#06b6d4' },
            { id: 'copy-question', text: '📄 Copy Question Text', color: '#6366f1' },
            { id: 'copy-answer', text: '📝 Copy Answer Only', color: '#8b5cf6' },
            { id: 'enable-auto-actions', text: '🔄 Enable Auto-Actions', color: '#059669' },
            { id: 'disable-auto-actions', text: '⏸️ Disable Auto-Actions', color: '#dc2626' }
        ];
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'action-button';
            button.id = btn.id;
            button.textContent = btn.text;
            button.style.background = btn.color;
            cheatsContent.appendChild(button);
        });

        // Response tab
        const responseContent = createTabContent('<i class="fa-regular fa-message"></i> response');
        const answersDisplay = document.createElement('div');
        answersDisplay.id = 'answers-display';
        answersDisplay.style.fontWeight = 'bold';
        answersDisplay.style.whiteSpace = "pre-wrap";
        answersDisplay.textContent = 'Answers will appear here...';
        responseContent.appendChild(answersDisplay);

        // AI tab
        const aiContent = createTabContent('<i class="fa-solid fa-brain"></i> AI');
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';

        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';

        const chatInput = document.createElement('input');
        chatInput.type = 'text';
        chatInput.className = 'chat-input';
        chatInput.placeholder = 'Type your message...';

        const sendButton = document.createElement('button');
        sendButton.className = 'action-button';
        sendButton.style.width = 'auto';
        sendButton.style.margin = '0';
        sendButton.textContent = 'Send';

        const botAnswer = document.createElement('button');
        botAnswer.className = 'action-button';
        botAnswer.id = 'botAnswer';
        botAnswer.style.width = '91%';
        botAnswer.style.margin = '3% auto';
        botAnswer.textContent = "AI Solve (Beta)";

        inputContainer.appendChild(chatInput);
        inputContainer.appendChild(sendButton);

        aiContent.appendChild(chatContainer);
        aiContent.appendChild(inputContainer);
        aiContent.appendChild(botAnswer);

        // Debug tab
        const debugContent = createTabContent('<i class="fa-solid fa-bug"></i> debug');
        debugContent.setAttribute('data-content', 'debug');
        
        const clearLogsButton = document.createElement('button');
        clearLogsButton.className = 'action-button';
        clearLogsButton.id = 'clear-logs';
        clearLogsButton.textContent = 'Clear Logs';
        debugContent.appendChild(clearLogsButton);

        menuContainer.appendChild(cheatsContent);
        menuContainer.appendChild(responseContent);
        menuContainer.appendChild(aiContent);
        menuContainer.appendChild(debugContent);

        menu.appendChild(menuContainer);
        document.body.appendChild(menu);

        return {
            menuButton,
            menuContainer,
            tabs: tabsContainer.querySelectorAll('.tab'),
            tabContents: menuContainer.querySelectorAll('.tab-content'),
            chatInput,
            sendButton,
            chatContainer
        };
    }

    function createTabContent(name, isActive = false) {
        const content = document.createElement('div');
        content.className = `tab-content${isActive ? ' active' : ''}`;
        content.setAttribute('data-content', name);
        return content;
    }

    // ==================== HELPER FUNCTIONS ====================
    
    function stripHTML(html) {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    function hasMathContent(text) {
        if (!text) return false;
        return text.includes('<math') || 
               text.includes('</math>') || 
               text.match(/\\\(|\\\[|\$\$?|\\begin{/) ||
               text.match(/\\frac|\\sqrt|\\sum|\\int|\\lim/);
    }

    // ==================== AUTO-ACTIONS ON NAVIGATION ====================

    let isFirstQuestion = true;
    let autoActionsEnabled = false;

    function enableAutoActions() {
        autoActionsEnabled = true;
        addDebugLog('success', 'Auto-actions enabled');
    }

    function disableAutoActions() {
        autoActionsEnabled = false;
        addDebugLog('info', 'Auto-actions disabled');
    }

    async function performAutoActions() {
        if (!autoActionsEnabled) return;
        
        addDebugLog('info', 'Performing auto-actions...');
        
        // Wait 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reveal answer with custom alert
        const result = getAnswerFromQuestion();
        if (result.success) {
            if (result.isMatching) {
                const matchText = result.matches.map(m => `${m.left} → ${m.right}`).join('\n');
                showCustomAlert(`✅ Answer:\n\n${matchText}`, 'success');
            } else {
                showCustomAlert(`✅ Answer: ${result.answer}`, 'success');
            }
        }
        
        addDebugLog('success', 'Auto-actions completed');
    }

    function setupAutoNavigation() {
        const nextButton = document.querySelector("#lrn_assess_next_btn");
        
        if (nextButton && !nextButton.dataset.autoActionAttached) {
            nextButton.addEventListener('click', async function(e) {
                addDebugLog('info', 'Next button clicked');
                
                // Let the navigation happen first
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Then perform auto-actions on the new question
                if (autoActionsEnabled) {
                    await performAutoActions();
                }
            });
            
            nextButton.dataset.autoActionAttached = "true";
            addDebugLog('success', 'Auto-navigation setup complete');
        }
    }

    // Check for next button periodically
    setInterval(setupAutoNavigation, 1000);

    // ==================== ENHANCED MATCHING EXTRACTION ====================
    
    function getMatchingLabelsFromDOM() {
        const leftItems = [];
        const rightItems = [];
        
        const stimulusElements = document.querySelectorAll('.lrn_stimulus_item, .lrn-stimulus-item, [data-lrn-component="stimulus"]');
        stimulusElements.forEach(el => {
            const text = stripHTML(el.innerHTML);
            if (text) leftItems.push(text);
        });
        
        const responseElements = document.querySelectorAll('.lrn_response_item, .lrn-response-item, [draggable="true"], .lrn_possibleResponse');
        responseElements.forEach(el => {
            const text = stripHTML(el.innerHTML);
            if (text) rightItems.push(text);
        });
        
        return { leftItems, rightItems };
    }

    function formatMatchingAnswer(question, validResponse) {
        addDebugLog('info', 'Formatting matching answer', { validResponse });
        
        let matches = [];
        const domData = getMatchingLabelsFromDOM();
        
        const leftMap = new Map();
        const rightMap = new Map();
        
        if (question.stimulus_list) {
            question.stimulus_list.forEach(item => {
                leftMap.set(item.value, stripHTML(item.label || item.value));
            });
        }
        
        if (question.possible_responses) {
            question.possible_responses.forEach((item, idx) => {
                const value = typeof item === 'object' ? item.value : item;
                const label = typeof item === 'object' ? (item.label || item.value) : item;
                rightMap.set(value, stripHTML(label));
            });
        }
        
        validResponse.forEach((match, idx) => {
            const leftValue = match[0];
            const rightValue = match[1];
            
            let leftText = leftMap.get(leftValue) || leftValue;
            let rightText = rightMap.get(rightValue) || rightValue;
            
            if (domData.leftItems.length > 0 && domData.rightItems.length > 0) {
                const leftIdx = question.stimulus_list?.findIndex(item => item.value === leftValue);
                const rightIdx = question.possible_responses?.findIndex(item => 
                    (typeof item === 'object' ? item.value : item) === rightValue
                );
                
                if (leftIdx !== -1 && domData.leftItems[leftIdx]) {
                    leftText = domData.leftItems[leftIdx];
                }
                if (rightIdx !== -1 && domData.rightItems[rightIdx]) {
                    rightText = domData.rightItems[rightIdx];
                }
            }
            
            const leftLabel = leftText === leftValue ? `[${leftValue}]` : '';
            const rightLabel = rightText === rightValue ? `[${rightValue}]` : '';
            
            matches.push({
                left: leftText,
                right: rightText,
                leftLabel: leftLabel,
                rightLabel: rightLabel,
                leftRaw: leftValue,
                rightRaw: rightValue
            });
        });
        
        addDebugLog('success', 'Matching pairs formatted', { matches });
        return matches;
    }

    // ==================== ANSWER EXTRACTION ====================
    
    function getAnswerFromQuestion(questionIndex = null) {
        addDebugLog('info', 'Getting answer from question...');
        
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            if (!currentItem || !currentItem.questions || currentItem.questions.length === 0) {
                addDebugLog('error', 'No questions found');
                return { success: false, message: "No questions found" };
            }

            if (questionIndex === null) {
                const allResults = [];
                for (let i = 0; i < currentItem.questions.length; i++) {
                    const result = getAnswerFromQuestion(i);
                    if (result.success) {
                        allResults.push({ index: i + 1, ...result });
                    }
                }
                
                if (allResults.length > 1) {
                    return { success: true, multiple: true, results: allResults };
                } else if (allResults.length === 1) {
                    return allResults[0];
                } else {
                    return { success: false, message: "No valid questions found" };
                }
            }

            const question = currentItem.questions[questionIndex];
            const questionType = question.type;
            
            addDebugLog('info', `Question ${questionIndex + 1} type: ${questionType}`, { question });

            if (questionType === "mcq" || questionType === "choicematrix") {
                const validResponse = question.validation.valid_response.value;
                let answerText = [];
                
                if (Array.isArray(validResponse)) {
                    validResponse.forEach(val => {
                        const option = question.options.find(opt => 
                            opt.value === val || opt.value === val.value
                        );
                        if (option) {
                            answerText.push(stripHTML(option.label || option.value));
                        }
                    });
                } else {
                    const option = question.options.find(opt => opt.value === validResponse);
                    if (option) {
                        answerText.push(stripHTML(option.label || option.value));
                    }
                }
                
                addDebugLog('success', 'MCQ answer extracted', answerText);
                return { 
                    success: true, 
                    answer: answerText.join(", "), 
                    type: questionType,
                    hasFormat: answerText.some(t => hasMathContent(t)),
                    questionIndex
                };
            }
            
            else if (questionType === "association") {
                const validResponse = question.validation.valid_response.value;
                const matches = formatMatchingAnswer(question, validResponse);
                
                return { 
                    success: true, 
                    matches: matches,
                    type: questionType,
                    hasFormat: false,
                    isMatching: true,
                    questionIndex
                };
            }
            
            else if (questionType === "clozetext" || questionType === "clozedropdown") {
                const validResponse = question.validation.valid_response.value;
                const answers = Array.isArray(validResponse) ? validResponse : [validResponse];
                
                addDebugLog('success', 'Cloze answer extracted', answers);
                return { 
                    success: true, 
                    answer: answers.join(", "), 
                    type: questionType,
                    hasFormat: false,
                    questionIndex
                };
            }
            else if (questionType === "clozeformula") {
                const validResponse = question.validation.valid_response.value;
                let answers = [];
                
                if (Array.isArray(validResponse)) {
                    validResponse.forEach(responseSet => {
                        if (Array.isArray(responseSet)) {
                            responseSet.forEach(answer => {
                                if (typeof answer === 'object' && answer.value) {
                                    answers.push(answer.value);
                                } else if (typeof answer === 'string') {
                                    answers.push(answer);
                                }
                            });
                        } else if (typeof responseSet === 'object' && responseSet.value) {
                            answers.push(responseSet.value);
                        } else if (typeof responseSet === 'string') {
                            answers.push(responseSet);
                        }
                    });
                }
                
                addDebugLog('success', 'Cloze formula answer extracted', answers);
                return { 
                    success: true, 
                    answer: answers.length > 0 ? answers.join(", ") : JSON.stringify(validResponse), 
                    type: questionType,
                    hasFormat: false,
                    rawAnswers: answers,
                    questionIndex
                };
            }
            else if (questionType === "orderlist") {
                const validResponse = question.validation.valid_response.value;
                addDebugLog('success', 'Order list answer extracted', validResponse);
                return { 
                    success: true, 
                    answer: validResponse.join(" → "), 
                    type: questionType,
                    hasFormat: false,
                    questionIndex
                };
            }
            
            else {
                const validResponse = question.validation.valid_response.value;
                addDebugLog('warning', 'Using generic fallback for question type', { questionType, validResponse });
                return { 
                    success: true, 
                    answer: JSON.stringify(validResponse), 
                    type: questionType,
                    hasFormat: false,
                    questionIndex
                };
            }
        } catch (error) {
            addDebugLog('error', 'Error getting answer: ' + error.message, error);
            return { success: false, message: error.message };
        }
    }

    // ==================== AUTO-FILL FUNCTIONALITY ====================
    
    function autoFillAnswer() {
        addDebugLog('info', 'Attempting auto-fill...');
        
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const questions = currentItem.questions;
            
            if (!questions || questions.length === 0) {
                showCustomAlert("No questions found!", 'error');
                return;
            }
            
            let totalFilled = 0;
            let failedQuestions = [];
            
            for (let qIndex = 0; qIndex < questions.length; qIndex++) {
                const question = questions[qIndex];
                
                if (!question.validation || !question.validation.valid_response || !question.validation.valid_response.value) {
                    addDebugLog('warning', `Q${qIndex + 1}: No valid response found, skipping`, { question });
                    failedQuestions.push(`Q${qIndex + 1}: No answer available`);
                    continue;
                }
                
                const validResponse = question.validation.valid_response.value;
                
                addDebugLog('info', `Processing question ${qIndex + 1} of ${questions.length}`, { type: question.type, response: validResponse });

                try {
                    if (question.type === "mcq") {
                        const correctValues = Array.isArray(validResponse) ? validResponse : [validResponse];
                        let radios = document.querySelectorAll(`input[type="radio"][data-lrn-response-id="${question.response_id}"]`);
                        
                        if (radios.length === 0) {
                            const allRadios = Array.from(document.querySelectorAll('input[type="radio"]'));
                            const startIdx = qIndex * 10;
                            radios = allRadios.slice(startIdx, startIdx + 20);
                        }
                        
                        let filled = 0;
                        radios.forEach(radio => {
                            const isCorrect = correctValues.some(val => 
                                radio.value === val || radio.value === (typeof val === 'object' ? val.value : val)
                            );
                            if (isCorrect && !radio.checked) {
                                radio.click();
                                filled++;
                                totalFilled++;
                                addDebugLog('success', `Q${qIndex + 1}: MCQ auto-filled`, { value: radio.value });
                                });
                        
                        if (filled === 0) {
                            failedQuestions.push(`Q${qIndex + 1}: No matching radio found`);
                        }
                        
                    } else if (question.type === "choicematrix") {
                        const correctValues = Array.isArray(validResponse) ? validResponse : [validResponse];
                        let checkboxes = document.querySelectorAll(`input[type="checkbox"][data-lrn-response-id="${question.response_id}"]`);
                        
                        if (checkboxes.length === 0) {
                            checkboxes = document.querySelectorAll('input[type="checkbox"]');
                        }
                        
                        let filled = 0;
                        correctValues.forEach(val => {
                            checkboxes.forEach(checkbox => {
                                const checkValue = typeof val === 'object' ? val.value : val;
                                if (checkbox.value === checkValue && !checkbox.checked) {
                                    checkbox.click();
                                    filled++;
                                    totalFilled++;
                                }
                            });
                        });
                        
                        if (filled === 0) {
                            failedQuestions.push(`Q${qIndex + 1}: No matching checkboxes found`);
                        }
                        
                    } else if (question.type === "clozedropdown") {
                        const answers = Array.isArray(validResponse) ? validResponse : [validResponse];
                        let selects = document.querySelectorAll(`select[data-lrn-response-id="${question.response_id}"]`);
                        
                        if (selects.length === 0) {
                            const allSelects = document.querySelectorAll('select');
                            selects = Array.from(allSelects).slice(qIndex * 5, (qIndex + 1) * 5);
                        }
                        
                        let filled = 0;
                        answers.forEach((answer, index) => {
                            if (selects[index]) {
                                selects[index].value = answer;
                                selects[index].dispatchEvent(new Event('change', { bubbles: true }));
                                filled++;
                                totalFilled++;
                                addDebugLog('success', `Q${qIndex + 1}: Dropdown ${index} filled`, { answer });
                            }
                        });
                        
                        if (filled === 0) {
                            failedQuestions.push(`Q${qIndex + 1}: No dropdowns found or filled`);
                        }
                        
                    } else if (question.type === "clozetext") {
                        const answers = Array.isArray(validResponse) ? validResponse : [validResponse];
                        let inputs = document.querySelectorAll(`input[type="text"][data-lrn-response-id="${question.response_id}"]`);
                        
                        if (inputs.length === 0) {
                            const allInputs = document.querySelectorAll('input[type="text"]');
                            inputs = Array.from(allInputs).slice(qIndex * 5, (qIndex + 1) * 5);
                        }
                        
                        let filled = 0;
                        answers.forEach((answer, index) => {
                            if (inputs[index]) {
                                inputs[index].value = answer;
                                inputs[index].dispatchEvent(new Event('input', { bubbles: true }));
                                filled++;
                                totalFilled++;
                                addDebugLog('success', `Q${qIndex + 1}: Text input ${index} filled`, { answer });
                            }
                        });
                        
                        if (filled === 0) {
                            failedQuestions.push(`Q${qIndex + 1}: No text inputs found or filled`);
                        }
                        
                    } else if (question.type === "clozeformula") {
                        const answers = Array.isArray(validResponse) ? validResponse : [validResponse];
                        let formulaInputs = document.querySelectorAll(`input[data-lrn-component="formula"][data-lrn-response-id="${question.response_id}"]`);
                        
                        if (formulaInputs.length === 0) {
                            formulaInputs = document.querySelectorAll('input[data-lrn-component="formula"], .lrn-formula-input, input.formula-input');
                        }
                        
                        let filled = 0;
                        answers.forEach((answer, index) => {
                            if (formulaInputs[index]) {
                                formulaInputs[index].value = answer;
                                formulaInputs[index].dispatchEvent(new Event('input', { bubbles: true }));
                                formulaInputs[index].dispatchEvent(new Event('change', { bubbles: true }));
                                filled++;
                                totalFilled++;
                                addDebugLog('success', `Q${qIndex + 1}: Formula input ${index} filled`, { answer });
                            }
                        });
                        
                        if (filled === 0) {
                            const textInputs = document.querySelectorAll('input[type="text"]');
                            answers.forEach((answer, index) => {
                                if (textInputs[index]) {
                                    textInputs[index].value = answer;
                                    textInputs[index].dispatchEvent(new Event('input', { bubbles: true }));
                                    filled++;
                                    totalFilled++;
                                }
                            });
                        }
                        
                        if (filled === 0) {
                            failedQuestions.push(`Q${qIndex + 1}: No formula inputs found or filled`);
                        }
                        
                    } else if (question.type === "association") {
                        failedQuestions.push(`Q${qIndex + 1}: Matching questions require manual drag-and-drop`);
                        
                    } else if (question.type === "orderlist") {
                        failedQuestions.push(`Q${qIndex + 1}: Order list requires manual drag-and-drop`);
                        
                    } else if (["formulaV2", "chemistry"].includes(question.type)) {
                        const input = document.querySelector(`input[data-lrn-response-id="${question.response_id}"]`) || 
                                     document.querySelector('input[data-lrn-component="formula"], input[type="text"]');
                        if (input) {
                            input.value = validResponse;
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                            totalFilled++;
                            addDebugLog('success', `Q${qIndex + 1}: Formula filled`, { answer: validResponse });
                        } else {
                            failedQuestions.push(`Q${qIndex + 1}: Formula input not found`);
                        }
                        
                    } else if (["plaintext", "shorttext", "longtext"].includes(question.type)) {
                        const textarea = document.querySelector(`textarea[data-lrn-response-id="${question.response_id}"]`) || 
                                        document.querySelector('textarea');
                        if (textarea) {
                            textarea.value = validResponse;
                            textarea.dispatchEvent(new Event('input', { bubbles: true }));
                            totalFilled++;
                            addDebugLog('success', `Q${qIndex + 1}: Text response filled`, { answer: validResponse });
                        } else {
                            failedQuestions.push(`Q${qIndex + 1}: Textarea not found`);
                        }
                        
                    } else {
                        failedQuestions.push(`Q${qIndex + 1}: Unsupported type (${question.type})`);
                    }
                    
                } catch (innerError) {
                    addDebugLog('error', `Q${qIndex + 1}: Error filling`, innerError);
                    failedQuestions.push(`Q${qIndex + 1}: ${innerError.message}`);
                }
            }
            
            let message = `✅ Auto-filled ${totalFilled} answer(s) across ${questions.length} question(s)!`;
            
            if (failedQuestions.length > 0) {
                message += `\n\n⚠️ Issues:\n${failedQuestions.join('\n')}`;
            }
            
            showCustomAlert(message, totalFilled > 0 ? 'success' : 'warning', 7000);
            
            if (totalFilled === 0) {
                console.log('Full question data:', questions);
            }
            
        } catch (error) {
            addDebugLog('error', 'Auto-fill error: ' + error.message, error);
            console.error('Full error:', error);
            showCustomAlert("Error auto-filling: " + error.message, 'error');
        }
    }

    // ==================== AI FUNCTIONALITY ====================
    
    function extractQuestionForAI() {
        addDebugLog('info', 'Extracting question for AI...');
        
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const question = currentItem.questions[0];
            
            let aiPrompt = "Question: " + stripHTML(question.stimulus) + "\n\n";

            if (question.type === "mcq" || question.type === "choicematrix") {
                aiPrompt += "Options:\n";
                question.options.forEach((opt, idx) => {
                    aiPrompt += `${idx + 1}. ${stripHTML(opt.label)}\n`;
                });
            } else if (question.type === "association") {
                aiPrompt += "Match these items:\n\nLeft column:\n";
                question.stimulus_list.forEach((item, idx) => {
                    const text = stripHTML(item.label || item.value);
                    aiPrompt += `${idx + 1}. ${text}\n`;
                });
                aiPrompt += "\nRight column:\n";
                question.possible_responses.forEach((item, idx) => {
                    const label = typeof item === 'object' ? (item.label || item.value) : item;
                    const text = stripHTML(label);
                    aiPrompt += `${idx + 1}. ${text}\n`;
                });
            } else if (question.type === "clozedropdown") {
                const template = stripHTML(question.template);
                aiPrompt += template + "\n\n";
                aiPrompt += "Dropdown options:\n";
                question.possible_responses.forEach((options, idx) => {
                    aiPrompt += `Blank ${idx + 1}: ${options.join(", ")}\n`;
                });
            }

            addDebugLog('success', 'Question extracted for AI', { prompt: aiPrompt.substring(0, 200) + '...' });
            return aiPrompt;
        } catch (error) {
            addDebugLog('error', 'Error extracting question for AI: ' + error.message, error);
            return null;
        }
    }

    async function solveWithAI() {
        const log = document.querySelector("#answers-display");
        addDebugLog('info', 'AI solve initiated');
        
        try {
            const prompt = extractQuestionForAI();
            if (!prompt) {
                log.textContent = "Could not extract question";
                switchToTab('response');
                return;
            }

            log.textContent = "AI is thinking...";
            switchToTab('response');

            const response = await fetch("https://api.ai21.com/studio/v1/chat/completions", {
                headers: {
                    "Authorization": "Bearer d098d436-b358-4039-b135-1324a4937d5b",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "jamba-large-1.7",
                    "messages": [{
                        "content": prompt + "\n\nProvide the answer clearly and explain your reasoning.",
                        "role": "user"
                    }],
                    "n": 1,
                    "max_tokens": 2000,
                    "temperature": 0.7
                }),
                method: "POST"
            });

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            addDebugLog('success', 'AI response received');
            renderFormattedText(aiResponse, log);
            
        } catch (error) {
            addDebugLog('error', 'AI solve error: ' + error.message, error);
            log.textContent = "Error: " + error.message;
        }
    }

    function renderFormattedText(text, container) {
        text = text
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/^### (.+)$/gm, '<h3 style="font-size: 1.1rem; font-weight: bold; margin: 1rem 0 0.5rem 0;">$1</h3>')
            .replace(/^## (.+)$/gm, '<h2 style="font-size: 1.2rem; font-weight: bold; margin: 1rem 0 0.5rem 0;">$1</h2>')
            .replace(/^# (.+)$/gm, '<h1 style="font-size: 1.3rem; font-weight: bold; margin: 1rem 0 0.5rem 0;">$1</h1>')
            .replace(/^- (.+)$/gm, '<li style="margin-left: 1.5rem;">$1</li>')
            .replace(/^\d+\. (.+)$/gm, '<li style="margin-left: 1.5rem; list-style-type: decimal;">$1</li>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
        
        text = text.replace(/(<li style="margin-left: 1\.5rem;">.*?<\/li>(?:<br>)?)+/g, (match) => {
            return '<ul style="margin: 0.5rem 0;">' + match.replace(/<br>/g, '') + '</ul>';
        });
        
        text = text.replace(/(<li style="margin-left: 1\.5rem; list-style-type: decimal;">.*?<\/li>(?:<br>)?)+/g, (match) => {
            return '<ol style="margin: 0.5rem 0; list-style-position: inside;">' + match.replace(/<br>/g, '') + '</ol>';
        });
        
        container.innerHTML = text;
        
        if (window.katex) {
            container.querySelectorAll('code').forEach(code => {
                try {
                    katex.render(code.textContent, code, { throwOnError: false });
                } catch (e) {}
            });
        }
    }

    // ==================== UI HELPERS ====================
    
    function switchToTab(tabName) {
        const tab = Array.from(elements.tabs).find(t => 
            t.dataset.tab.includes(tabName)
        );
        if (tab) tab.click();
    }

    function showResponse(content, isHTML = false) {
        const display = document.querySelector("#answers-display");
        if (isHTML) {
            display.innerHTML = content;
        } else {
            display.textContent = content;
        }
        switchToTab('response');
    }

    function displayMatchingAnswer(matches) {
        const display = document.querySelector("#answers-display");
        
        let html = '<div style="font-weight: bold; margin-bottom: 1rem; color: #111827;">Correct Matches:</div>';
        
        matches.forEach((match, idx) => {
            html += `<div class="match-pair">
                <div style="margin-bottom: 0.25rem;">
                    <span class="match-label">Left ${match.leftLabel || match.leftRaw}</span>
                    <strong>${match.left}</strong>
                </div>
                <div style="text-align: center; margin: 0.5rem 0;">
                    <span class="match-arrow">⬇ matches ⬇</span>
                </div>
                <div>
                    <span class="match-label">Right ${match.rightLabel || match.rightRaw}</span>
                    <strong>${match.right}</strong>
                </div>
            </div>`;
        });
        
        display.innerHTML = html;
        switchToTab('response');
    }

    // ==================== EVENT HANDLERS ====================
    
    createStyles();
    const elements = createMenuStructure();
    let chatHistory = [];

    // Menu toggle
    elements.menuButton.addEventListener('click', () => {
        const isHidden = elements.menuContainer.style.display === 'none' || 
                        !elements.menuContainer.style.display;
        elements.menuContainer.style.display = isHidden ? 'flex' : 'none';
        elements.menuButton.textContent = isHidden ? 'Hide Menu' : 'Show Menu';
    });

    // Tab switching
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetContent = tab.dataset.tab;
            elements.tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.dataset.content === targetContent) {
                    content.classList.add('active');
                }
            });
        });
    });

    // ==================== CHEAT BUTTON HANDLERS ====================

    // Reveal answer
    document.getElementById('reveal-answer').addEventListener('click', () => {
        addDebugLog('info', 'Reveal answer clicked');
        const result = getAnswerFromQuestion();
        
        if (!result.success) {
            showResponse("Error: " + result.message);
            return;
        }

        if (result.multiple && result.results) {
            let allAnswersHTML = '<div style="font-weight: bold; margin-bottom: 1rem; color: #111827;">All Questions & Answers:</div>';
            
            result.results.forEach((res, idx) => {
                allAnswersHTML += `<div style="border: 2px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem; background: #f9fafb;">`;
                allAnswersHTML += `<div style="font-weight: bold; color: #3b82f6; margin-bottom: 0.5rem;">Question ${res.index} (${res.type})</div>`;
                
                if (res.isMatching) {
                    res.matches.forEach(match => {
                        allAnswersHTML += `<div class="match-pair" style="margin: 0.5rem 0;">
                            <strong>${match.left}</strong> → <strong>${match.right}</strong>
                        </div>`;
                    });
                } else {
                    allAnswersHTML += `<div style="padding: 0.5rem; background: white; border-radius: 0.375rem;">${res.answer}</div>`;
                }
                
                allAnswersHTML += `</div>`;
            });
            
            const answerElement = document.querySelector("#answers-display");
            answerElement.innerHTML = allAnswersHTML;
            switchToTab('response');
            
        } else if (result.isMatching) {
            displayMatchingAnswer(result.matches);
        } else {
            const answerElement = document.querySelector("#answers-display");
            answerElement.innerHTML = `<strong>Answer (${result.type}):</strong><br><br>${result.answer}`;
            switchToTab('response');
        }
    });

    // Auto-fill
    document.getElementById('auto-fill-answer').addEventListener('click', autoFillAnswer);

    // Highlight correct
    document.getElementById('highlight-correct').addEventListener('click', () => {
        addDebugLog('info', 'Highlight correct clicked');
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const question = currentItem.questions[0];
            
            if (question.type !== "mcq" && question.type !== "choicematrix") {
                showCustomAlert("Highlighting only works for multiple choice questions", 'warning');
                return;
            }
            
            const validResponse = question.validation.valid_response.value;
            const correctValues = Array.isArray(validResponse) ? validResponse : [validResponse];
            
            const allInputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            let highlightedCount = 0;
            
            allInputs.forEach(input => {
                const isCorrect = correctValues.some(val => {
                    return input.value === val || input.value === (typeof val === 'object' ? val.value : val);
                });
                
                if (isCorrect) {
                    let container = input.closest('.lrn_option, .lrn-option, .lrn_response_container, label, div[class*="option"]');
                    if (!container) container = input.parentElement;
                    
                    if (container) {
                        container.style.cssText += `
                            background: #dcfce7 !important;
                            border: 3px solid #10b981 !important;
                            border-radius: 0.5rem !important;
                            padding: 0.75rem !important;
                            margin: 0.25rem 0 !important;
                            box-shadow: 0 0 10px rgba(16, 185, 129, 0.3) !important;
                        `;
                        highlightedCount++;
                    }
                }
            });
            
            if (highlightedCount > 0) {
                addDebugLog('success', `Highlighted ${highlightedCount} correct answer(s)`);
                showCustomAlert(`✅ Highlighted ${highlightedCount} correct answer(s)!`, 'success');
            } else {
                addDebugLog('warning', 'No answers highlighted');
                showCustomAlert("Could not highlight - check Response tab for answer", 'warning');
            }
            
        } catch (error) {
            addDebugLog('error', 'Highlight error', error);
            showCustomAlert("Error: " + error.message, 'error');
        }
    });

    // Show hints
    document.getElementById('show-hints').addEventListener('click', () => {
        addDebugLog('info', 'Show hints clicked');
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const question = currentItem.questions[0];
            
            const hints = [];
            if (question.metadata?.distractor_rationale) {
                hints.push("📌 Distractor Info:\n" + stripHTML(question.metadata.distractor_rationale));
            }
            if (question.metadata?.sample_answer) {
                hints.push("💡 Sample Answer:\n" + stripHTML(question.metadata.sample_answer));
            }
            if (question.metadata?.acknowledgements) {
                hints.push("📚 Source:\n" + question.metadata.acknowledgements);
            }
            if (question.instructor_stimulus) {
                hints.push("👨‍🏫 Instructor Notes:\n" + stripHTML(question.instructor_stimulus));
            }
            
            const hintText = hints.length > 0 ? hints.join("\n\n") : "No hints available for this question";
            showResponse(hintText);
        } catch (error) {
            addDebugLog('error', 'Show hints error', error);
            showResponse("Error: " + error.message);
        }
    });

    // Explanation
    document.getElementById('explanation').addEventListener('click', () => {
        addDebugLog('info', 'Explanation clicked');
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const question = currentItem.questions[0];
            const explanation = question.metadata?.le_incorrect_feedbacks || 
                              question.metadata?.sample_answer ||
                              "No explanation available";
            showResponse(stripHTML(explanation));
        } catch (error) {
            showResponse("Error: " + error.message);
        }
    });

    // Copy question
    document.getElementById('copy-question').addEventListener('click', () => {
        addDebugLog('info', 'Copy question clicked');
        const prompt = extractQuestionForAI();
        if (prompt) {
            navigator.clipboard.writeText(prompt).then(() => {
                showCustomAlert("📋 Question copied to clipboard!", 'success');
                addDebugLog('success', 'Question copied');
            });
        }
    });

    // Copy answer only
    document.getElementById('copy-answer').addEventListener('click', () => {
        addDebugLog('info', 'Copy answer clicked');
        const result = getAnswerFromQuestion();
        if (result.success) {
            const answerText = result.isMatching 
                ? result.matches.map(m => `${m.left} → ${m.right}`).join('\n')
                : result.answer;
            
            navigator.clipboard.writeText(answerText).then(() => {
                showCustomAlert("📝 Answer copied to clipboard!", 'success');
                addDebugLog('success', 'Answer copied');
            });
        } else {
            showCustomAlert("Error: " + result.message, 'error');
        }
    });

    // Enable auto-actions
    document.getElementById('enable-auto-actions').addEventListener('click', () => {
        enableAutoActions();
        showCustomAlert('✅ Auto-actions enabled!\n\n• First question: Shows answer now\n• Next questions: Shows answer after clicking Next\n• 1 second delay before reveal', 'success', 5000);
        
        if (isFirstQuestion) {
            isFirstQuestion = false;
            performAutoActions();
        }
    });

    // Disable auto-actions
    document.getElementById('disable-auto-actions').addEventListener('click', () => {
        disableAutoActions();
        showCustomAlert('⏸️ Auto-actions disabled', 'info');
    });

    // ==================== AI & CHAT ====================

    // AI solve
    document.getElementById('botAnswer').addEventListener('click', solveWithAI);

    // Chat functionality
    async function sendMessage() {
        const message = elements.chatInput.value.trim();
        if (!message) return;

        addMessageToChat(message, 'user');
        elements.chatInput.value = '';
        chatHistory.push({ content: message, role: "user" });

        try {
            elements.sendButton.disabled = true;
            elements.sendButton.textContent = 'Sending...';

            const response = await fetch("https://api.ai21.com/studio/v1/chat/completions", {
                headers: {
                    "Authorization": "Bearer d098d436-b358-4039-b135-1324a4937d5b",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "jamba-large-1.7",
                    "messages": chatHistory,
                    "n": 1,
                    "max_tokens": 2000,
                    "temperature": 0.7
                }),
                method: "POST"
            });

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            addMessageToChat(aiResponse, 'assistant');
            chatHistory.push({ content: aiResponse, role: "assistant" });
            addDebugLog('info', 'Chat message sent and received');
        } catch (error) {
            addDebugLog('error', 'Chat error: ' + error.message, error);
            addMessageToChat('Error sending message', 'assistant');
        } finally {
            elements.sendButton.disabled = false;
            elements.sendButton.textContent = 'Send';
        }
    }

    function addMessageToChat(message, role) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${role}-message`;
        
        if (role === 'assistant') {
            let formattedMessage = message
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.+?)\*/g, '<em>$1</em>')
                .replace(/^- (.+)$/gm, '<li>$1</li>')
                .replace(/^\d+\. (.+)$/gm, '<li style="list-style-type: decimal;">$1</li>')
                .replace(/\n\n/g, '<br><br>')
                .replace(/\n/g, '<br>');
            
            formattedMessage = formattedMessage.replace(/(<li>.*?<\/li>(?:<br>)?)+/g, (match) => {
                return '<ul style="margin: 0.5rem 0; padding-left: 1.5rem;">' + match.replace(/<br>/g, '') + '</ul>';
            });
            
            formattedMessage = formattedMessage.replace(/(<li style="list-style-type: decimal;">.*?<\/li>(?:<br>)?)+/g, (match) => {
                return '<ol style="margin: 0.5rem 0; padding-left: 1.5rem;">' + match.replace(/<br>/g, '') + '</ol>';
            });
            
            messageElement.innerHTML = formattedMessage;
        } else {
            messageElement.textContent = message;
        }
        
        elements.chatContainer.appendChild(messageElement);
        elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
    }

    elements.sendButton.addEventListener('click', sendMessage);
    elements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Clear logs
    document.getElementById('clear-logs').addEventListener('click', () => {
        debugLogs.length = 0;
        updateDebugDisplay();
        addDebugLog('info', 'Logs cleared');
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft" && !e.target.matches('input, textarea')) {
            document.querySelector("#prevPage > button, .lrn-prev-button")?.click();
        } else if (e.key === "ArrowRight" && !e.target.matches('input, textarea')) {
            document.querySelector("#lrn_assess_next_btn")?.click();
        } else if (e.key === 'p' && e.altKey) {
            e.preventDefault();
            document.getElementById('reveal-answer').click();
        } else if (e.key === 'a' && e.altKey) {
            e.preventDefault();
            document.getElementById('auto-fill-answer').click();
        } else if (e.key === 'h' && e.altKey) {
            e.preventDefault();
            document.getElementById('highlight-correct').click();
        }
    });

    // Initialize
    updateDebugDisplay();
    addDebugLog('success', 'Script initialized successfully');

    // Load MathJax
    const mathJaxConfig = document.createElement('script');
    mathJaxConfig.type = 'text/javascript';
    mathJaxConfig.text = `
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                processEscapes: true
            },
            svg: {
                fontCache: 'global'
            }
        };
    `;
    document.head.appendChild(mathJaxConfig);

    const mathJaxScript = document.createElement('script');
    mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    mathJaxScript.async = true;
    document.head.appendChild(mathJaxScript);

console.log('%c✓ Enhanced Learnosity Script Loaded', 'color: #10b981; font-weight: bold; font-size: 14px;');
    console.log('%cKeyboard Shortcuts:', 'color: #3b82f6; font-weight: bold;');
    console.log('%c  Alt+P: Reveal Answer', 'color: #6b7280;');
    console.log('%c  Alt+A: Auto-fill Answer', 'color: #6b7280;');
    console.log('%c  Alt+H: Highlight Correct', 'color: #6b7280;');
    console.log('%c  Arrow Keys: Navigate Questions', 'color: #6b7280;');

} 

// ==================== CONNEXUS IFRAME BUTTON ====================

if (window.location.href.includes('www.connexus.com')) {
    setInterval(() => {
        const iframe = document.getElementById("lessonContentIFrame");
        if (iframe && !iframe.dataset.buttonAdded) {
            const btn = document.createElement("button");
            btn.textContent = "🤫";
            btn.style.cssText = `
                position: absolute;
                top: ${iframe.getBoundingClientRect().top + 10}px;
                right: ${iframe.getBoundingClientRect().left - 97}px;
                z-index: 9999;
                background: #722362;
                border: 2px solid #D2DB0E;
                border-right: none;
                border-radius: 20px 0 0 20px;
                padding: 10px;
                font-weight: bold;
                color: white;
                cursor: pointer;
                transition: all 0.3s;
            `;
            btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
            btn.onmouseout = () => btn.style.transform = 'scale(1)';
            btn.onclick = () => window.open(iframe.src, "_blank");
            
            document.body.appendChild(btn);
            iframe.dataset.buttonAdded = "true";
        }
    }, 100);
}
