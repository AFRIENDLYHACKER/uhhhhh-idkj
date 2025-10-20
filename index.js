// Complete Enhanced Learnosity/Connexus Educational Platform Script
// Features: Improved answer display, auto-fill support, debug tab, better AI extraction, copy question feature

/*! KaTeX library inline */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.katex=t():e.katex=t()}("undefined"!=typeof self?self:this,(function(){return function(){"use strict";var e={d:function(t,r){for(var n in r)e.o(r,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:r[n]})},o:function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}},t={};e.d(t,{default:function(){return na}});var r=function e(t,r){this.name=void 0,this.position=void 0,this.length=void 0,this.rawMessage=void 0;var n,a,i="KaTeX parse error: "+t,o=r&&r.loc;if(o&&o.start<=o.end){var s=o.lexer.input;n=o.start,a=o.end,n===s.length?i+=" at end of input: ":i+=" at position "+(n+1)+": ";var l=s.slice(n,a).replace(/[^]/g,"$&\u0332");i+=(n>15?"\u2026"+s.slice(n-15,n):s.slice(0,n))+l+(a+15<s.length?s.slice(a,a+15)+"\u2026":s.slice(a))}var h=new Error(i);return h.name="ParseError",h.__proto__=e.prototype,h.position=n,null!=n&&null!=a&&(h.length=a-n),h.rawMessage=t,h};r.prototype.__proto__=Error.prototype;var n=r;return t=t.default}()}));

// Debug Logger System
const DebugLogger = {
  logs: [],
  maxLogs: 100,
  
  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { timestamp, message, type };
    this.logs.push(logEntry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    this.updateDebugDisplay();
    
    // Also log to console
    const consoleMethod = type === 'error' ? 'error' : type === 'warn' ? 'warn' : 'log';
    console[consoleMethod](`[${timestamp}] ${message}`);
  },
  
  updateDebugDisplay() {
    const debugDisplay = document.getElementById('debug-display');
    if (!debugDisplay) return;
    
    debugDisplay.innerHTML = this.logs.map(log => {
      const colors = {
        error: '#ef4444',
        warn: '#f59e0b',
        success: '#10b981',
        info: '#3b82f6'
      };
      const color = colors[log.type] || colors.info;
      
      return `<div style="padding: 0.5rem; margin-bottom: 0.25rem; background: rgba(0,0,0,0.05); border-radius: 0.25rem; border-left: 3px solid ${color};">
        <span style="color: #6b7280; font-size: 0.75rem;">${log.timestamp}</span>
        <span style="color: ${color}; margin-left: 0.5rem; font-weight: bold;">[${log.type.toUpperCase()}]</span>
        <div style="margin-top: 0.25rem; word-wrap: break-word;">${log.message}</div>
      </div>`;
    }).reverse().join('');
  },
  
  clear() {
    this.logs = [];
    this.updateDebugDisplay();
  }
};

// Strip HTML tags but preserve math notation
function stripHTML(html) {
  if (!html) return '';
  
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Get text content (automatically strips HTML)
  let text = temp.textContent || temp.innerText || '';
  
  // Clean up extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

// Enhanced answer extraction with detailed logging
function getAnswerFromQuestion() {
  DebugLogger.log('Starting answer extraction...', 'info');
  
  try {
    const currentItem = window.LearnosityAssess.getCurrentItem();
    if (!currentItem || !currentItem.questions || !currentItem.questions[0]) {
      DebugLogger.log('No question found in current item', 'error');
      return { success: false, message: "No question found" };
    }

    const question = currentItem.questions[0];
    const questionType = question.type;
    
    DebugLogger.log(`Question type: ${questionType}`, 'info');
    
    // Handle different question types with improved display
    if (questionType === "mcq" || questionType === "choicematrix") {
      const validResponse = question.validation.valid_response.value;
      let answerText = [];
      
      DebugLogger.log(`Valid response: ${JSON.stringify(validResponse)}`, 'info');
      
      if (Array.isArray(validResponse)) {
        validResponse.forEach(val => {
          const option = question.options.find(opt => opt.value === val || opt.value === val.value);
          if (option) {
            const label = stripHTML(option.label || option.value);
            answerText.push(label);
            DebugLogger.log(`Found option: ${label}`, 'success');
          }
        });
      } else {
        const option = question.options.find(opt => opt.value === validResponse);
        if (option) {
          const label = stripHTML(option.label || option.value);
          answerText.push(label);
          DebugLogger.log(`Found option: ${label}`, 'success');
        }
      }
      
      return { 
        success: true, 
        answer: answerText.join("\n\n"), 
        type: questionType,
        rawData: question
      };
    } 
    else if (questionType === "association") {
      // Matching questions - improved display with actual text
      const validResponse = question.validation.valid_response.value;
      const stimulusList = question.stimulus_list || [];
      const possibleResponses = question.possible_responses || [];
      
      DebugLogger.log(`Matching question with ${validResponse.length} pairs`, 'info');
      
      let matches = [];
      validResponse.forEach((match, idx) => {
        // Find the actual text for left side
        const leftItem = stimulusList.find(s => s.value === match[0]);
        const leftText = leftItem ? stripHTML(leftItem.label) : match[0];
        
        // Find the actual text for right side
        const rightText = stripHTML(possibleResponses[match[1]] || match[1]);
        
        matches.push(`${leftText} → ${rightText}`);
        DebugLogger.log(`Match ${idx + 1}: ${leftText} → ${rightText}`, 'success');
      });
      
      return { 
        success: true, 
        answer: matches.join("\n\n"), 
        type: questionType,
        rawData: question
      };
    }
    else if (questionType === "clozetext" || questionType === "clozedropdown") {
      const validResponse = question.validation.valid_response.value;
      const answers = Array.isArray(validResponse) ? validResponse : [validResponse];
      
      DebugLogger.log(`Cloze question with ${answers.length} blanks`, 'info');
      
      return { 
        success: true, 
        answer: answers.map((a, i) => `Blank ${i + 1}: ${a}`).join("\n"), 
        type: questionType,
        rawData: question
      };
    }
    else if (questionType === "orderlist") {
      const validResponse = question.validation.valid_response.value;
      DebugLogger.log(`Order list with ${validResponse.length} items`, 'info');
      
      return { 
        success: true, 
        answer: validResponse.map((v, i) => `${i + 1}. ${stripHTML(v)}`).join("\n"), 
        type: questionType,
        rawData: question
      };
    }
    else {
      const validResponse = question.validation.valid_response.value;
      DebugLogger.log(`Generic question type: ${questionType}`, 'warn');
      
      return { 
        success: true, 
        answer: JSON.stringify(validResponse, null, 2), 
        type: questionType,
        rawData: question
      };
    }
  } catch (error) {
    DebugLogger.log(`Error extracting answer: ${error.message}`, 'error');
    console.error("Detailed error:", error);
    return { success: false, message: error.message };
  }
}

// Enhanced auto-fill function with support for multiple question types
function autoFillAnswer() {
  DebugLogger.log('Starting auto-fill...', 'info');
  
  try {
    const result = getAnswerFromQuestion();
    if (!result.success) {
      DebugLogger.log(`Auto-fill failed: ${result.message}`, 'error');
      alert("Could not auto-fill: " + result.message);
      return;
    }

    const question = result.rawData;
    const validResponse = question.validation.valid_response.value;
    let filled = false;

    if (question.type === "mcq") {
      // Multiple choice - radio buttons
      const correctValue = Array.isArray(validResponse) ? validResponse[0] : validResponse;
      const radios = document.querySelectorAll('input[type="radio"]');
      
      DebugLogger.log(`Looking for radio with value: ${correctValue}`, 'info');
      
      radios.forEach(radio => {
        if (radio.value === correctValue || radio.value === correctValue.value) {
          radio.click();
          filled = true;
          DebugLogger.log('Radio button clicked', 'success');
        }
      });
    } 
    else if (question.type === "choicematrix") {
      // Multiple selection - checkboxes
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      
      validResponse.forEach(val => {
        checkboxes.forEach(checkbox => {
          if (checkbox.value === val || checkbox.value === val.value) {
            checkbox.click();
            filled = true;
            DebugLogger.log(`Checkbox clicked: ${val}`, 'success');
          }
        });
      });
    }
    else if (question.type === "association") {
      // Matching questions - show instructions
      DebugLogger.log('Association questions require manual interaction', 'warn');
      
      const matches = [];
      validResponse.forEach(match => {
        const leftItem = question.stimulus_list.find(s => s.value === match[0]);
        const leftText = leftItem ? stripHTML(leftItem.label) : match[0];
        const rightText = stripHTML(question.possible_responses[match[1]] || match[1]);
        matches.push(`${leftText} → ${rightText}`);
      });
      
      alert("Matching Question Auto-Fill:\n\nPlease manually match these items:\n\n" + matches.join("\n\n") + "\n\nMatching questions cannot be auto-filled automatically due to drag-and-drop interface restrictions.");
      return;
    }
    else if (question.type === "clozedropdown") {
      // Dropdown selections
      const selects = document.querySelectorAll('select');
      
      DebugLogger.log(`Found ${selects.length} dropdowns`, 'info');
      
      validResponse.forEach((val, idx) => {
        if (selects[idx]) {
          const options = selects[idx].querySelectorAll('option');
          options.forEach(option => {
            if (option.value === val || option.text === val) {
              selects[idx].value = option.value;
              selects[idx].dispatchEvent(new Event('change', { bubbles: true }));
              filled = true;
              DebugLogger.log(`Dropdown ${idx + 1} set to: ${val}`, 'success');
            }
          });
        }
      });
    }
    else if (question.type === "clozetext") {
      // Text inputs
      const inputs = document.querySelectorAll('input[type="text"]');
      
      DebugLogger.log(`Found ${inputs.length} text inputs`, 'info');
      
      validResponse.forEach((val, idx) => {
        if (inputs[idx]) {
          inputs[idx].value = val;
          inputs[idx].dispatchEvent(new Event('input', { bubbles: true }));
          inputs[idx].dispatchEvent(new Event('change', { bubbles: true }));
          filled = true;
          DebugLogger.log(`Text input ${idx + 1} filled: ${val}`, 'success');
        }
      });
    }
    
    if (filled) {
      DebugLogger.log('Auto-fill completed successfully!', 'success');
      alert("Answer auto-filled!");
    } else {
      DebugLogger.log('Could not find matching input elements', 'warn');
      alert("Could not auto-fill. This question type may not be supported yet.");
    }
  } catch (error) {
    DebugLogger.log(`Auto-fill error: ${error.message}`, 'error');
    alert("Error auto-filling: " + error.message);
  }
}

// Copy question and options feature
function copyQuestionAndOptions() {
  DebugLogger.log('Copying question and options...', 'info');
  
  try {
    const currentItem = window.LearnosityAssess.getCurrentItem();
    if (!currentItem || !currentItem.questions || !currentItem.questions[0]) {
      DebugLogger.log('No question found to copy', 'error');
      alert("No question found");
      return;
    }

    const question = currentItem.questions[0];
    let formattedText = "";
    
    // Question text
    formattedText += "QUESTION:\n";
    formattedText += stripHTML(question.stimulus) + "\n\n";
    
    // Options/choices based on question type
    if (question.type === "mcq" || question.type === "choicematrix") {
      formattedText += "OPTIONS:\n";
      question.options.forEach((opt, idx) => {
        formattedText += `${String.fromCharCode(65 + idx)}. ${stripHTML(opt.label || opt.value)}\n`;
      });
    }
    else if (question.type === "association") {
      formattedText += "MATCH ITEMS:\n\nLeft Column:\n";
      question.stimulus_list.forEach((item, idx) => {
        formattedText += `${idx + 1}. ${stripHTML(item.label)}\n`;
      });
      formattedText += "\nRight Column:\n";
      question.possible_responses.forEach((item, idx) => {
        formattedText += `${idx + 1}. ${stripHTML(item)}\n`;
      });
    }
    else if (question.type === "clozedropdown") {
      formattedText += "FILL IN THE BLANKS:\n";
      formattedText += stripHTML(question.template) + "\n\n";
      formattedText += "Dropdown Options:\n";
      question.possible_responses.forEach((options, idx) => {
        formattedText += `Blank ${idx + 1}: ${options.join(", ")}\n`;
      });
    }
    else if (question.type === "clozetext") {
      formattedText += "FILL IN THE BLANKS:\n";
      formattedText += stripHTML(question.template);
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(formattedText).then(() => {
      DebugLogger.log('Question copied to clipboard successfully', 'success');
      alert("Question copied! You can paste it anywhere.");
    }).catch(err => {
      DebugLogger.log(`Clipboard error: ${err.message}`, 'error');
      alert("Failed to copy: " + err.message);
    });
    
  } catch (error) {
    DebugLogger.log(`Copy error: ${error.message}`, 'error');
    alert("Error copying: " + error.message);
  }
}

// Enhanced AI question extraction
function extractQuestionForAI() {
  DebugLogger.log('Extracting question for AI...', 'info');
  
  try {
    const currentItem = window.LearnosityAssess.getCurrentItem();
    if (!currentItem || !currentItem.questions || !currentItem.questions[0]) {
      DebugLogger.log('No question found for AI', 'error');
      return "No question found";
    }

    const question = currentItem.questions[0];
    let aiPrompt = "Question: " + stripHTML(question.stimulus) + "\n\n";

    if (question.type === "mcq" || question.type === "choicematrix") {
      aiPrompt += "Options:\n";
      question.options.forEach((opt, idx) => {
        aiPrompt += `${String.fromCharCode(65 + idx)}. ${stripHTML(opt.label || opt.value)}\n`;
      });
    } 
    else if (question.type === "association") {
      aiPrompt += "Match these items:\n\nLeft column:\n";
      question.stimulus_list.forEach((item, idx) => {
        aiPrompt += `${idx + 1}. ${stripHTML(item.label)}\n`;
      });
      aiPrompt += "\nRight column:\n";
      question.possible_responses.forEach((item, idx) => {
        aiPrompt += `${idx + 1}. ${stripHTML(item)}\n`;
      });
    } 
    else if (question.type === "clozedropdown") {
      aiPrompt += stripHTML(question.template) + "\n\n";
      aiPrompt += "Dropdown options:\n";
      question.possible_responses.forEach((options, idx) => {
        aiPrompt += `Blank ${idx + 1}: ${options.join(", ")}\n`;
      });
    }
    else if (question.type === "clozetext") {
      aiPrompt += stripHTML(question.template);
    }
    
    DebugLogger.log('Question extracted for AI successfully', 'success');
    return aiPrompt;
    
  } catch (error) {
    DebugLogger.log(`AI extraction error: ${error.message}`, 'error');
    return "Error extracting question: " + error.message;
  }
}

// Initialize when script loads
if (window.location.href.includes('prodpcx-cdn-vegaviewer.emssvc.connexus.com') || 
    window.location.href.includes('gaca.schoology.com')) {
  
  DebugLogger.log('Script initialized successfully', 'success');
  
  // Load Font Awesome
  const fontAwesomeLink = document.createElement('link');
  fontAwesomeLink.rel = 'stylesheet';
  fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css';
  fontAwesomeLink.integrity = 'sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==';
  fontAwesomeLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontAwesomeLink);
  
  // Load KaTeX
  const kateXLink = document.createElement('link');
  kateXLink.rel = 'stylesheet';
  kateXLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
  document.head.appendChild(kateXLink);
  
  // Create menu styles with Debug tab
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .modern-menu { 
      position: fixed; 
      top: 1rem; 
      left: 1rem; 
      z-index: 9999; 
      font-family: system-ui, -apple-system, sans-serif; 
      padding: 1rem;
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
      background: #111827E6; 
      transform: scale(1.03); 
    }
    .menu-container { 
      display: none; 
      background: white; 
      border-radius: 0.75rem; 
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); 
      margin-top: 0.75rem; 
      width: 24rem; 
      flex-direction: column; 
      overflow: hidden; 
    }
    .tabs { 
      display: flex; 
      margin: 20px auto 0; 
      border: 5px solid #f9f9f9; 
      background: #f9f9f9; 
      border-radius: 10px; 
      width: 90%; 
    }
    .tab { 
      flex: 1; 
      padding: 0.75rem; 
      background: none; 
      border: none; 
      cursor: pointer; 
      font-weight: bold; 
      color: #6b7280; 
      transition: all 0.2s; 
      border-bottom: 2px solid transparent; 
    }
    .tab.active { 
      color: black; 
      border-bottom-color: #3b82f6; 
      background: white; 
      border-radius: 10px; 
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); 
    }
    .tab:hover { 
      color: #4b5563; 
      transform: scale(1.05); 
    }
    .tab-content { 
      display: none; 
      padding: 1rem; 
    }
    .tab-content.active { 
      display: block; 
      overflow-y: auto; 
      max-height: 300px; 
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
      background: #111827E6; 
      transform: scale(1.03); 
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
    #debug-display { 
      font-family: monospace; 
      font-size: 0.75rem; 
      max-height: 250px; 
      overflow-y: auto; 
      background: #f9fafb;
      padding: 0.5rem;
      border-radius: 0.375rem;
    }
    #answers-display {
      font-weight: bold;
      white-space: pre-line;
      line-height: 1.6;
    }
  `;
  document.head.appendChild(styleSheet);
  
  // Create menu HTML with Debug tab
  const menu = document.createElement('div');
  menu.className = 'modern-menu';
  menu.innerHTML = `
    <button class="menu-button">Show Menu</button>
    <div class="menu-container">
      <div class="tabs">
        <button class="tab active" data-tab="cheats"><i class="fa-solid fa-shield-dog"></i> Cheats</button>
        <button class="tab" data-tab="response"><i class="fa-regular fa-message"></i> Response</button>
        <button class="tab" data-tab="ai"><i class="fa-solid fa-brain"></i> AI</button>
        <button class="tab" data-tab="debug"><i class="fa-solid fa-bug"></i> Debug</button>
      </div>
      
      <div class="tab-content active" data-content="cheats">
        <button class="action-button" id="reveal-answer">Reveal Answer (Alt+P)</button>
        <button class="action-button" id="show-all-answers">Show All Answers</button>
        <button class="action-button" id="auto-fill-answer">Auto Fill Answer</button>
        <button class="action-button" id="copy-question">Copy Question & Options</button>
        <button class="action-button" id="explanation">Explanation</button>
        <button class="action-button" id="question-info">Question Info</button>
        <button class="action-button" id="random-answer">Random Answer</button>
        <button class="action-button" id="skip-to-next">Skip To Next</button>
      </div>
      
      <div class="tab-content" data-content="response">
        <div id="answers-display">Answers shown here...</div>
      </div>
      
      <div class="tab-content" data-content="ai">
        <div class="chat-container"></div>
        <div class="input-container">
          <input type="text" class="chat-input" placeholder="Type your message...">
          <button class="action-button" style="width: auto; margin: 0;">Send</button>
        </div>
        <button class="action-button" id="botAnswer" style="width: 91%; margin: 3% auto;">AI Solve (Not always 100% accurate)</button>
      </div>
      
      <div class="tab-content" data-content="debug">
        <button class="action-button" id="clear-logs" style="width: 91%; margin-bottom: 1rem;">Clear Logs</button>
        <div id="debug-display">Debug logs will appear here...</div>
      </div>
    </div>
  `;
  document.body.appendChild(menu);
  
  // Event listeners
  const menuButton = menu.querySelector('.menu-button');
  const menuContainer = menu.querySelector('.menu-container');
  
  menuButton.addEventListener('click', () => {
    const isHidden = menuContainer.style.display === 'none' || !menuContainer.style.display;
    menuContainer.style.display = isHidden ? 'flex' : 'none';
    menuButton.textContent = isHidden ? 'Hide Menu' : 'Show Menu';
    DebugLogger.log(`Menu ${isHidden ? 'opened' : 'closed'}`, 'info');
  });
  
  // Tab switching
  menu.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      menu.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const targetContent = tab.dataset.tab;
      menu.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.dataset.content === targetContent);
      });
      
      DebugLogger.log(`Switched to ${targetContent} tab`, 'info');
    });
  });
  
  // Button event listeners
  document.getElementById('reveal-answer').addEventListener('click', () => {
    DebugLogger.log('Reveal answer button clicked', 'info');
    const result = getAnswerFromQuestion();
    const answerElement = document.querySelector("#answers-display");
    
    if (!result.success) {
      answerElement.textContent = "Error: " + result.message;
    } else {
      answerElement.textContent = `Answer (${result.type}):\n\n${result.answer}`;
    }
    
    menu.querySelectorAll('.tab')[1].click(); // Switch to response tab
  });
  
  document.getElementById('show-all-answers').addEventListener('click', () => {
    DebugLogger.log('Show all answers button clicked', 'info');
    try {
      const currentItem = window.LearnosityAssess.getCurrentItem();
      const question = currentItem.questions[0];
      let allOptions = [];
      
      if (question.options) {
        question.options.forEach((opt, idx) => {
          allOptions.push(`${String.fromCharCode(65 + idx)}. ${stripHTML(opt.label || opt.value)}`);
        });
        DebugLogger.log(`Found ${allOptions.length} options`, 'success');
      } else if (question.possible_responses) {
        question.possible_responses.forEach((resp, idx) => {
          allOptions.push(`${idx + 1}. ${stripHTML(resp)}`);
        });
        DebugLogger.log(`Found ${allOptions.length} possible responses`, 'success');
      }
      
      document.querySelector("#answers-display").textContent = "All Options:\n\n" + allOptions.join("\n\n");
      menu.querySelectorAll('.tab')[1].click();
    } catch (error) {
      DebugLogger.log(`Show all answers error: ${error.message}`, 'error');
      document.querySelector("#answers-display").textContent = "Error: " + error.message;
    }
  });
  
  document.getElementById('auto-fill-answer').addEventListener('click', autoFillAnswer);
  document.getElementById('copy-question').addEventListener('click', copyQuestionAndOptions);
  
  document.getElementById('explanation').addEventListener('click', () => {
    DebugLogger.log('Explanation button clicked', 'info');
    try {
      const currentItem = window.LearnosityAssess.getCurrentItem();
      const explanation = currentItem.questions[0].metadata?.le_incorrect_feedbacks || "No explanation available";
      document.querySelector("#answers-display").innerHTML = explanation;
      DebugLogger.log('Explanation displayed', 'success');
      menu.querySelectorAll('.tab')[1].click();
    } catch (error) {
      DebugLogger.log(`Explanation error: ${error.message}`, 'error');
      document.querySelector("#answers-display").textContent = "Error: " + error.message;
    }
  });
  
  document.getElementById('question-info').addEventListener('click', () => {
    DebugLogger.log('Question info button clicked', 'info');
    try {
      const currentItem = window.LearnosityAssess.getCurrentItem();
      const question = currentItem.questions[0];
      const info = `Type: ${question.type}
Points: ${question.metadata?.score_percentage || 'N/A'}
Difficulty: ${question.metadata?.difficulty || 'N/A'}
Question ID: ${question.response_id || 'N/A'}`;
      document.querySelector("#answers-display").textContent = info;
      DebugLogger.log('Question info displayed', 'success');
      menu.querySelectorAll('.tab')[1].click();
    } catch (error) {
      DebugLogger.log(`Question info error: ${error.message}`, 'error');
      document.querySelector("#answers-display").textContent = "Error: " + error.message;
    }
  });
  
  document.getElementById('random-answer').addEventListener('click', () => {
    DebugLogger.log('Random answer button clicked', 'info');
    const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    if (inputs.length > 0) {
      const randomInput = inputs[Math.floor(Math.random() * inputs.length)];
      randomInput.click();
      DebugLogger.log('Random answer selected', 'success');
    } else {
      DebugLogger.log('No inputs found for random selection', 'warn');
    }
  });
  
  document.getElementById('skip-to-next').addEventListener('click', () => {
    DebugLogger.log('Skip to next button clicked', 'info');
    const nextButton = document.querySelector("#nextPage > button");
    if (nextButton) {
      nextButton.click();
      DebugLogger.log('Navigated to next page', 'success');
    } else {
      DebugLogger.log('Next button not found', 'warn');
    }
  });
  
  document.getElementById('clear-logs').addEventListener('click', () => {
    DebugLogger.clear();
    DebugLogger.log('Logs cleared', 'success');
  });
  
  // AI Solve button
  document.getElementById('botAnswer').addEventListener('click', async () => {
    const log = document.querySelector("#answers-display");
    DebugLogger.log('AI Solve initiated', 'info');
    
    try {
      const questionText = extractQuestionForAI();
      
      if (!questionText || questionText.startsWith("Error") || questionText === "No question found") {
        log.textContent = questionText;
        DebugLogger.log('No valid question for AI', 'error');
        menu.querySelectorAll('.tab')[1].click();
        return;
      }

      log.textContent = "AI is thinking...";
      menu.querySelectorAll('.tab')[1].click();
      
      DebugLogger.log('Sending request to AI API', 'info');

      const response = await fetch("https://api.ai21.com/studio/v1/chat/completions", {
        headers: {
          "Authorization": "Bearer d098d436-b358-4039-b135-1324a4937d5b",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "jamba-large-1.7",
          "messages": [{
            "content": "Answer this question clearly and concisely. Provide the answer and brief explanation:\n\n" + questionText,
            "role": "user"
          }],
          "n": 1,
          "max_tokens": 4000,
          "temperature": 0.7,
          "top_p": 1,
          "stop": []
        }),
        method: "POST"
      });

      const data = await response.json();
      const fetchedText = data.choices[0].message.content;

      log.textContent = fetchedText;
      DebugLogger.log('AI response received successfully', 'success');
      menu.querySelectorAll('.tab')[1].click();
    } catch (error) {
      DebugLogger.log(`AI error: ${error.message}`, 'error');
      log.textContent = "Error: " + error.message;
      menu.querySelectorAll('.tab')[1].click();
    }
  });
  
  // Chat functionality
  let chatHistory = [];
  const chatInput = menu.querySelector('.chat-input');
  const sendButton = menu.querySelector('.input-container button');
  const chatContainer = menu.querySelector('.chat-container');
  
  function addMessageToChat(message, role) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${role}-message`;
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    DebugLogger.log(`Chat message added (${role})`, 'info');
  }
  
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessageToChat(message, 'user');
    chatInput.value = '';
    chatHistory.push({ content: message, role: "user" });

    try {
      sendButton.disabled = true;
      sendButton.textContent = 'Sending...';
      DebugLogger.log('Sending chat message to AI', 'info');

      const response = await fetch("https://api.ai21.com/studio/v1/chat/completions", {
        headers: {
          "Authorization": "Bearer d098d436-b358-4039-b135-1324a4937d5b",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "jamba-large-1.7",
          "messages": chatHistory,
          "n": 1,
          "max_tokens": 4096,
          "temperature": 0.7,
          "top_p": 1,
          "stop": []
        }),
        method: "POST"
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      addMessageToChat(aiResponse, 'assistant');
      chatHistory.push({ content: aiResponse, role: "assistant" });
      DebugLogger.log('Chat response received', 'success');
    } catch (error) {
      DebugLogger.log(`Chat error: ${error.message}`, 'error');
      addMessageToChat('Error sending message', 'assistant');
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = 'Send';
    }
  }
  
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      const prevButton = document.querySelector("#prevPage > button");
      if (prevButton) {
        prevButton.click();
        DebugLogger.log('Navigated to previous page (keyboard)', 'info');
      }
    } else if (e.key === "ArrowRight") {
      const nextButton = document.querySelector("#nextPage > button");
      if (nextButton) {
        nextButton.click();
        DebugLogger.log('Navigated to next page (keyboard)', 'info');
      }
    } else if (e.key === 'p' && e.altKey) {
      e.preventDefault();
      document.getElementById('reveal-answer').click();
      DebugLogger.log('Reveal answer triggered (Alt+P)', 'info');
    }
  });
  
  // Right-click copy functionality
  document.addEventListener('contextmenu', (event) => {
    if (event.ctrlKey) { // Hold Ctrl and right-click to copy
      event.preventDefault();
      if (event.target.nodeType === Node.ELEMENT_NODE) {
        const text = event.target.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
          DebugLogger.log(`Text copied via right-click: ${text.substring(0, 50)}...`, 'success');
          alert(`Copied: ${text.substring(0, 50)}...`);
        }).catch((error) => {
          DebugLogger.log(`Copy failed: ${error.message}`, 'error');
          alert(`Failed to copy: ${error}`);
        });
      }
    }
  });
  
  DebugLogger.log('All event listeners attached successfully', 'success');
  DebugLogger.log('Script ready for use!', 'success');
}

// Connexus iframe button
if (window.location.href.includes('www.connexus.com')) {
  DebugLogger.log('Connexus iframe detected, adding open button', 'info');
  
  setInterval(() => {
    const iframe = document.getElementById("lessonContentIFrame");
    if (iframe && !iframe.dataset.buttonAdded) {
      let btn = document.createElement("button");
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
        transition: all 0.2s;
      `;
      btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
      btn.onmouseout = () => btn.style.transform = 'scale(1)';
      btn.onclick = () => {
        window.open(iframe.src, "_blank");
        DebugLogger.log('Opened iframe in new tab', 'success');
      };
      
      document.body.appendChild(btn);
      iframe.dataset.buttonAdded = "true";
      DebugLogger.log('Iframe open button added', 'success');
    }
  }, 100);
}
