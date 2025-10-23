// Enhanced Learnosity/Connexus Educational Platform Script
// Improved with better logging, matching question support, and cleaner AI integration

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

        // Cheats tab with 20 options
        const cheatsContent = createTabContent('<i class="fa-solid fa-shield-dog"></i> cheats', true);
        const buttons = [
            { id: 'reveal-answer', text: '🎯 Reveal Answer', color: '#059669' },
            { id: 'auto-fill-answer', text: '⚡ Auto Fill Answer', color: '#dc2626' },
            { id: 'highlight-correct', text: '✨ Highlight Correct', color: '#f59e0b' },
            { id: 'show-all-answers', text: '📋 Show All Options', color: '#3b82f6' },
            { id: 'copy-question', text: '📄 Copy Question Text', color: '#6366f1' },
            { id: 'copy-answer', text: '📝 Copy Answer Only', color: '#8b5cf6' },
            { id: 'explanation', text: '💡 Show Explanation', color: '#06b6d4' },
            { id: 'show-hints', text: '🔍 Show Hints', color: '#14b8a6' },
            { id: 'question-info', text: 'ℹ️ Question Details', color: '#64748b' },
            { id: 'question-metadata', text: '📊 Full Metadata', color: '#475569' },
            { id: 'remove-wrong', text: '❌ Remove Wrong Answers', color: '#ef4444' },
            { id: 'show-scoring', text: '🎓 Show Scoring Info', color: '#84cc16' },
            { id: 'freeze-timer', text: '⏸️ Freeze Timer', color: '#f97316' },
            { id: 'show-standards', text: '📚 Show Standards', color: '#0ea5e9' },
            { id: 'extract-all-data', text: '🗂️ Extract All Data', color: '#8b5cf6' },
            { id: 'random-answer', text: '🎲 Random Answer', color: '#ec4899' },
            { id: 'skip-to-next', text: '⏭️ Skip to Next', color: '#6b7280' },
            { id: 'skip-to-prev', text: '⏮️ Skip to Previous', color: '#6b7280' },
            { id: 'flag-question', text: '🚩 Flag Question', color: '#f43f5e' },
            { id: 'show-difficulty', text: '⚖️ Show Difficulty', color: '#a855f7' }
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
    
    function getAnswerFromQuestion() {
        addDebugLog('info', 'Getting answer from question...');
        
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            if (!currentItem || !currentItem.questions || !currentItem.questions[0]) {
                addDebugLog('error', 'No question found');
                return { success: false, message: "No question found" };
            }

            const question = currentItem.questions[0];
            const questionType = question.type;
            
            addDebugLog('info', `Question type: ${questionType}`, { question });

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
                    hasFormat: answerText.some(t => hasMathContent(t))
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
                    isMatching: true
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
                    hasFormat: false
                };
            }
            
            else if (questionType === "orderlist") {
                const validResponse = question.validation.valid_response.value;
                addDebugLog('success', 'Order list answer extracted', validResponse);
                return { 
                    success: true, 
                    answer: validResponse.join(" → "), 
                    type: questionType,
                    hasFormat: false
                };
            }
            
            else {
                const validResponse = question.validation.valid_response.value;
                addDebugLog('warning', 'Using generic fallback for question type', { questionType, validResponse });
                return { 
                    success: true, 
                    answer: JSON.stringify(validResponse), 
                    type: questionType,
                    hasFormat: false
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
            const question = currentItem.questions[0];
            const validResponse = question.validation.valid_response.value;

            if (question.type === "mcq") {
                const radios = document.querySelectorAll('input[type="radio"]');
                const correctValue = Array.isArray(validResponse) ? validResponse[0] : validResponse;
                
                let filled = false;
                radios.forEach(radio => {
                    if (radio.value === correctValue || radio.value === correctValue.value) {
                        radio.click();
                        filled = true;
                        addDebugLog('success', 'MCQ auto-filled', { value: radio.value });
                    }
                });
                
                if (!filled) addDebugLog('warning', 'No matching radio button found');
                alert("Answer auto-filled!");
                
            } else if (question.type === "choicematrix") {
                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                let filledCount = 0;
                
                validResponse.forEach(val => {
                    checkboxes.forEach(checkbox => {
                        if (checkbox.value === val || checkbox.value === val.value) {
                            checkbox.click();
                            filledCount++;
                        }
                    });
                });
                
                addDebugLog('success', `Checkboxes auto-filled: ${filledCount}`);
                alert("Answer auto-filled!");
                
            } else if (question.type === "association") {
                addDebugLog('warning', 'Auto-fill for matching questions not fully supported yet');
                alert("Matching questions require manual drag-and-drop. The correct pairs are shown in the Response tab.");
                
            } else if (question.type === "clozedropdown") {
                const selects = document.querySelectorAll('select');
                validResponse.forEach((answer, index) => {
                    if (selects[index]) {
                        selects[index].value = answer;
                        selects[index].dispatchEvent(new Event('change', { bubbles: true }));
                        addDebugLog('success', `Dropdown ${index} filled`, { answer });
                    }
                });
                alert("Answer auto-filled!");
                
            } else {
                addDebugLog('warning', `Auto-fill not supported for type: ${question.type}`);
                alert(`Auto-fill not supported for question type: ${question.type}`);
                return;
            }
            
        } catch (error) {
            addDebugLog('error', 'Auto-fill error: ' + error.message, error);
            alert("Error auto-filling: " + error.message);
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
                    aiPrompt += `${idx + 1}. ${stripHTML(item.label)}\n`;
                });
                aiPrompt += "\nRight column:\n";
                question.possible_responses.forEach((item, idx) => {
                    const label = typeof item === 'object' ? item.label : item;
                    aiPrompt += `${idx + 1}. ${stripHTML(label)}\n`;
                });
            } else if (question.type === "clozedropdown") {
                aiPrompt += stripHTML(question.template);
                aiPrompt += "\n\nDropdown options:\n";
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
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/\n\n/g, '<br><br>');
        
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

        if (result.isMatching) {
            displayMatchingAnswer(result.matches);
        } else {
            const answerElement = document.querySelector("#answers-display");
            answerElement.innerHTML = `<strong>Answer (${result.type}):</strong><br><br>${result.answer}`;
            switchToTab('response');
        }
    });

    // Auto-fill
    document.getElementById('auto-fill-answer').addEventListener('click', autoFillAnswer);

    // Highlight correct - FIXED
    document.getElementById('highlight-correct').addEventListener('click', () => {
        addDebugLog('info', 'Highlight correct clicked');
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const question = currentItem.questions[0];
            
            if (question.type !== "mcq" && question.type !== "choicematrix") {
                alert("Highlighting only works for multiple choice questions");
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
                alert(`Correct answer(s) highlighted in green! (${highlightedCount} found)`);
            } else {
                addDebugLog('warning', 'No answers highlighted - trying alternative method');
                
                const correctOption = question.options.find(opt => correctValues.includes(opt.value));
                if (correctOption) {
                    const optionText = stripHTML(correctOption.label);
                    const allLabels = document.querySelectorAll('label, .lrn_option, .lrn-option, [class*="option"]');
                    
                    allLabels.forEach(label => {
                        if (label.textContent.includes(optionText)) {
                            label.style.cssText += `
                                background: #dcfce7 !important;
                                border: 3px solid #10b981 !important;
                                border-radius: 0.5rem !important;
                                padding: 0.75rem !important;
                                box-shadow: 0 0 10px rgba(16, 185, 129, 0.3) !important;
                            `;
                            highlightedCount++;
                        }
                    });
                }
                
                if (highlightedCount > 0) {
                    alert(`Highlighted by text matching! (${highlightedCount} found)`);
                } else {
                    alert("Could not find elements to highlight. Check the Response tab for the answer.");
                }
            }
            
        } catch (error) {
            addDebugLog('error', 'Highlight error', error);
            alert("Error: " + error.message);
        }
    });

    // Show all answers
    document.getElementById('show-all-answers').addEventListener('click', () => {
        addDebugLog('info', 'Show all answers clicked');
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const question = currentItem.questions[0];
            let allOptions = [];
            
            if (question.options) {
                question.options.forEach((opt, idx) => {
                    allOptions.push(`${idx + 1}. ${stripHTML(opt.label || opt.value)}`);
                });
                showResponse("All Options:\n\n" + allOptions.join("\n\n"));
            } else if (question.type === "association") {
                let output = "Left Column:\n";
                question.stimulus_list.forEach((item, idx) => {
                    output += `${idx + 1}. ${stripHTML(item.label)}\n`;
                });
                output += "\nRight Column:\n";
                question.possible_responses.forEach((item, idx) => {
                    const label = typeof item === 'object' ? item.label : item;
                    output += `${idx + 1}. ${stripHTML(label)}\n`;
                });
                showResponse(output);
            } else {
                showResponse("No options available for this question type");
            }
        } catch (error) {
            addDebugLog('error', 'Show all answers error', error);
            showResponse("Error: " + error.message);
        }
    });

    // Copy question
    document.getElementById('copy-question').addEventListener('click', () => {
        addDebugLog('info', 'Copy question clicked');
        const prompt = extractQuestionForAI();
        if (prompt) {
            navigator.clipboard.writeText(prompt).then(() => {
                alert("Question copied to clipboard!");
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
                alert("Answer copied to clipboard!");
                addDebugLog('success', 'Answer copied');
            });
        } else {
            alert("Error: " + result.message);
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

    // Question info
    document.getElementById('question-info').addEventListener('click', () => {
        addDebugLog('info', 'Question info clicked');
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const question = currentItem.questions[0];
            const metadata = question.metadata || {};
            
            const info = `📋 Question Information:

Type: ${question.type}
Reference: ${question.reference || 'N/A'}
Points: ${metadata.score_percentage || 'N/A'}
Difficulty: ${metadata.difficulty || 'N/A'}
Standard: ${metadata.le_standard_code || 'N/A'}`;
            
            showResponse(info);
        } catch (error) {
            showResponse("Error: " + error.message);
        }
    });

    // Question metadata
    document.getElementById('question-metadata').addEventListener('click', () => {
        addDebugLog('info', 'Question metadata clicked');
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const question = currentItem.questions[0];
            
            showResponse(JSON.stringify(question, null, 2));
        } catch (error) {
            showResponse("Error: " + error.message);
        }
    });

    // Remove wrong answers
    document.getElementById('remove-wrong').addEventListener('click', () => {
        addDebugLog('info', 'Remove wrong answers clicked');
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const question = currentItem.questions[0];
            
            if (question.type !== "mcq" && question.type !== "choicematrix") {
                alert("This only works for multiple choice questions");
                return;
            }
            
            const validResponse = question.validation.valid_response.value;
            const correctValues = Array.isArray(validResponse) ? validResponse : [validResponse];
            
            const allInputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            let removedCount = 0;
            
            allInputs.forEach(input => {
                const isCorrect = correctValues.some(val => {
                    return input.value === val || input.value === (typeof val === 'object' ? val.value : val);
                });
                
                if (!isCorrect) {
                    let container = input.closest('.lrn_option, .lrn-option, label, div[class*="option"]');
                    if (!container) container = input.parentElement;
                    
                    if (container) {
                        container.style.cssText += 'opacity: 0.2 !important; pointer-events: none !important;';
                        removedCount++;
                    }
                }
            });
            
            addDebugLog('success', `Removed ${removedCount} wrong answer(s)`);
            alert(`Faded out ${removedCount} wrong answer(s)!`);
        } catch (error) {
            addDebugLog('error', 'Remove wrong error', error);
            alert("Error: " + error.message);
        }
    });

    // Show scoring info
    document.getElementById('show-scoring').addEventListener('click', () => {
        addDebugLog('info', 'Show scoring clicked');
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const question = currentItem.questions[0];
            const metadata = question.metadata || {};
            
            const scoring = `🎓 Scoring Information:

Points Available: ${metadata.score_percentage || 'N/A'}
Partial Credit: ${question.validation?.partial_scoring ? 'Yes' : 'No'}
Penalty: ${metadata.penalty || 'None'}
Scoring Type: ${question.validation?.scoring_type || 'Standard'}`;
            
            showResponse(scoring);
        } catch (error) {
            showResponse("Error: " + error.message);
        }
    });

    // Freeze timer
    document.getElementById('freeze-timer').addEventListener('click', () => {
        addDebugLog('info', 'Freeze timer clicked');
        try {
            const timerElements = document.querySelectorAll('[class*="timer"], [class*="countdown"], [id*="timer"]');
            timerElements.forEach(el => {
                el.style.cssText += 'animation-play-state: paused !important;';
            });
            
            const highestId = window.setTimeout(() => {}, 0);
            for (let i = 0; i < highestId; i++) {
                window.clearInterval(i);
            }
            
            addDebugLog('success', 'Timer freeze attempted');
            alert("Timer freeze attempted! (May not work on all platforms)");
        } catch (error) {
            addDebugLog('error', 'Timer freeze error', error);
            alert("Error: " + error.message);
        }
    });

    // Show standards
    document.getElementById('show-standards').addEventListener('click', () => {
        addDebugLog('info', 'Show standards clicked');
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const question = currentItem.questions[0];
            const metadata = question.metadata || {};
            
            const standards = `📚 Educational Standards:

Standard Code: ${metadata.le_standard_code || 'N/A'}
Skills: ${metadata.skills?.join(', ') || 'N/A'}
DOK Level: ${metadata.depth_of_knowledge || 'N/A'}
Blooms Taxonomy: ${metadata.blooms_taxonomy || 'N/A'}
Subject: ${metadata.subject || 'N/A'}
Grade: ${metadata.grade || 'N/A'}`;
            
            showResponse(standards);
        } catch (error) {
            showResponse("Error: " + error.message);
        }
    });

    // Extract all data
    document.getElementById('extract-all-data').addEventListener('click', () => {
        addDebugLog('info', 'Extract all data clicked');
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const allData = {
                item: currentItem,
                questions: currentItem.questions,
                session: window.LearnosityAssess.getSessionId?.(),
                state: window.LearnosityAssess.getState?.()
            };
            
            const dataStr = JSON.stringify(allData, null, 2);
            navigator.clipboard.writeText(dataStr).then(() => {
                showResponse("All data extracted and copied to clipboard!\n\nPreview:\n" + dataStr.substring(0, 500) + "...");
            });
        } catch (error) {
            addDebugLog('error', 'Extract data error', error);
            showResponse("Error: " + error.message);
        }
    });

    // Random answer
    document.getElementById('random-answer').addEventListener('click', () => {
        const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        if (inputs.length > 0) {
            const randomInput = inputs[Math.floor(Math.random() * inputs.length)];
            randomInput.click();
            addDebugLog('info', 'Random answer selected');
            alert("Random answer selected!");
        } else {
            alert("No selectable options found");
        }
    });

    // Skip to next
    document.getElementById('skip-to-next').addEventListener('click', () => {
        const nextButton = document.querySelector("#nextPage > button, .lrn-next-button, button[data-action='next']");
        if (nextButton) {
            nextButton.click();
            addDebugLog('info', 'Skipped to next');
        } else {
            alert("Next button not found");
        }
    });

    // Skip to previous
    document.getElementById('skip-to-prev').addEventListener('click', () => {
        const prevButton = document.querySelector("#prevPage > button, .lrn-prev-button, button[data-action='prev']");
        if (prevButton) {
            prevButton.click();
            addDebugLog('info', 'Skipped to previous');
        } else {
            alert("Previous button not found");
        }
    });

    // Flag question
    document.getElementById('flag-question').addEventListener('click', () => {
        addDebugLog('info', 'Flag question clicked');
        try {
            const flagButton = document.querySelector('[class*="flag"], button[title*="flag" i], button[aria-label*="flag" i]');
            if (flagButton) {
                flagButton.click();
                alert("Question flagged!");
            } else {
                alert("Flag button not found");
            }
        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    // Show difficulty
    document.getElementById('show-difficulty').addEventListener('click', () => {
        addDebugLog('info', 'Show difficulty clicked');
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const question = currentItem.questions[0];
            const metadata = question.metadata || {};
            
            const difficulty = `⚖️ Question Difficulty:

Difficulty Level: ${metadata.difficulty || 'N/A'}
DOK (Depth of Knowledge): ${metadata.depth_of_knowledge || 'N/A'}
Blooms Level: ${metadata.blooms_taxonomy || 'N/A'}
Estimated Time: ${metadata.estimated_time || 'N/A'}
Average Score: ${metadata.average_score || 'N/A'}`;
            
            showResponse(difficulty);
        } catch (error) {
            showResponse("Error: " + error.message);
        }
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
        messageElement.textContent = message;
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
            document.querySelector("#nextPage > button, .lrn-next-button")?.click();
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
                inlineMath: [[', '], ['\\\\(', '\\\\)']],
                displayMath: [['$', '$'], ['\\\\[', '\\\\]']],
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
