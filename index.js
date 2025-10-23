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
        
        // Update debug tab if it exists
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
            '<i class="fa-solid fa-info-circle"></i> info',
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

        // Cheats tab
        const cheatsContent = createTabContent('<i class="fa-solid fa-shield-dog"></i> cheats', true);
        const buttons = [
            'reveal-answer',
            'show-all-answers',
            'auto-fill-answer',
            'copy-question',
            'highlight-correct',
            'show-hints',
            'question-metadata',
            'random-answer',
            'skip-to-next'
        ];
        
        buttons.forEach(id => {
            const button = document.createElement('button');
            button.className = 'action-button';
            button.style.fontWeight = 'bold';
            button.id = id;
            button.textContent = id.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
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

        // Info tab
        const infoContent = createTabContent('<i class="fa-solid fa-info-circle"></i> info');
        const infoDisplay = document.createElement('div');
        infoDisplay.id = 'info-display';
        infoDisplay.innerHTML = '<div style="color: #6b7280;">Question info will appear here...</div>';
        infoContent.appendChild(infoDisplay);

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
        menuContainer.appendChild(infoContent);
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
        // Try to extract actual text from DOM elements
        const leftItems = [];
        const rightItems = [];
        
        // Look for stimulus items in the DOM
        const stimulusElements = document.querySelectorAll('.lrn_stimulus_item, .lrn-stimulus-item');
        stimulusElements.forEach(el => {
            const text = stripHTML(el.innerHTML);
            if (text) leftItems.push(text);
        });
        
        // Look for response items
        const responseElements = document.querySelectorAll('.lrn_response_item, .lrn-response-item, [draggable="true"]');
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
        
        // Create lookup maps
        const leftMap = new Map();
        const rightMap = new Map();
        
        // Map stimulus list (left column)
        if (question.stimulus_list) {
            question.stimulus_list.forEach(item => {
                leftMap.set(item.value, stripHTML(item.label || item.value));
            });
        }
        
        // Map possible responses (right column)
        if (question.possible_responses) {
            question.possible_responses.forEach((item, idx) => {
                const value = typeof item === 'object' ? item.value : item;
                const label = typeof item === 'object' ? (item.label || item.value) : item;
                rightMap.set(value, stripHTML(label));
            });
        }
        
        // Process each match
        validResponse.forEach((match, idx) => {
            const leftValue = match[0];
            const rightValue = match[1];
            
            // Try to get text from maps
            let leftText = leftMap.get(leftValue) || leftValue;
            let rightText = rightMap.get(rightValue) || rightValue;
            
            // If still showing codes, try DOM extraction
            if (domData.leftItems.length > 0 && domData.rightItems.length > 0) {
                // Try to match by index or content
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
            
            // Format the match with labels if still showing codes
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

            // MCQ and ChoiceMatrix
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
            
            // Association (Matching) - ENHANCED
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
            
            // Cloze (Fill-in-blank / Dropdown)
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
            
            // Order list
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
            
            // Generic fallback
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
                
            } else {
                addDebugLog('warning', `Auto-fill not supported for type: ${question.type}`);
                alert(`Auto-fill not supported for question type: ${question.type}`);
                return;
            }
            
            alert("Answer auto-filled!");
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
        // Simple markdown-like rendering with KaTeX support
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

    // Reveal answer - ENHANCED FOR MATCHING
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

    // Auto-fill
    document.getElementById('auto-fill-answer').addEventListener('click', autoFillAnswer);

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

    // Highlight correct answer (MCQ only)
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
            
            // Find and highlight correct options
            const labels = document.querySelectorAll('.lrn_option, .lrn-option, label');
            labels.forEach(label => {
                const input = label.querySelector('input');
                if (input && correctValues.includes(input.value)) {
                    label.style.background = '#dcfce7';
                    label.style.border = '2px solid #10b981';
                    label.style.borderRadius = '0.5rem';
                    label.style.padding = '0.5rem';
                }
            });
            
            addDebugLog('success', 'Correct answers highlighted');
            alert("Correct answer(s) highlighted in green!");
        } catch (error) {
            addDebugLog('error', 'Highlight error', error);
            alert("Error: " + error.message);
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
                hints.push("Distractor Info: " + question.metadata.distractor_rationale);
            }
            if (question.metadata?.sample_answer) {
                hints.push("Sample Answer: " + stripHTML(question.metadata.sample_answer));
            }
            if (question.metadata?.acknowledgements) {
                hints.push("Source: " + question.metadata.acknowledgements);
            }
            
            const hintText = hints.length > 0 ? hints.join("\n\n") : "No hints available for this question";
            showResponse(hintText);
        } catch (error) {
            addDebugLog('error', 'Show hints error', error);
            showResponse("Error: " + error.message);
        }
    });

    // Question metadata - NEW
    document.getElementById('question-metadata').addEventListener('click', () => {
        addDebugLog('info', 'Question metadata clicked');
        try {
            const currentItem = window.LearnosityAssess.getCurrentItem();
            const question = currentItem.questions[0];
            const metadata = question.metadata || {};
            
            const infoDisplay = document.getElementById('info-display');
            let html = '<div style="font-family: monospace; font-size: 0.85rem;">';
            
            const fields = [
                { label: 'Question Type', value: question.type },
                { label: 'Reference', value: question.reference },
                { label: 'Points', value: metadata.score_percentage },
                { label: 'Difficulty', value: metadata.difficulty },
                { label: 'Skills', value: metadata.skills?.join(', ') },
                { label: 'Standard', value: metadata.le_standard_code },
                { label: 'DOK Level', value: metadata.depth_of_knowledge },
                { label: 'Blooms Taxonomy', value: metadata.blooms_taxonomy },
                { label: 'Author', value: metadata.author },
                { label: 'Status', value: metadata.status }
            ];
            
            fields.forEach(field => {
                if (field.value) {
                    html += `<div style="margin-bottom: 0.75rem; padding: 0.5rem; background: #f9fafb; border-radius: 0.375rem;">
                        <div style="color: #6b7280; font-size: 0.75rem; margin-bottom: 0.25rem;">${field.label}</div>
                        <div style="color: #111827; font-weight: bold;">${field.value}</div>
                    </div>`;
                }
            });
            
            html += '</div>';
            infoDisplay.innerHTML = html;
            switchToTab('info');
            addDebugLog('success', 'Metadata displayed');
        } catch (error) {
            addDebugLog('error', 'Metadata error', error);
            document.getElementById('info-display').textContent = "Error: " + error.message;
            switchToTab('info');
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

    // Clear logs button
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

    // Initialize debug display
    updateDebugDisplay();
    addDebugLog('success', 'Script initialized successfully');

    // Load MathJax for LaTeX rendering
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
