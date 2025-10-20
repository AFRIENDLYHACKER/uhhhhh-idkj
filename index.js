if (window.location.href.startsWith('https://www.connexus.com/homepage#/student/today')) {

const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css';
fontAwesomeLink.integrity = 'sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==';
fontAwesomeLink.crossOrigin = 'anonymous';
fontAwesomeLink.referrerPolicy = 'no-referrer';

const kateXLink = document.createElement('link');
kateXLink.rel = 'stylesheet';
kateXLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css'

document.head.appendChild(fontAwesomeLink);
document.head.appendChild(kateXLink);

function createStyles() {
  const styleSheet = document.createElement('style');
  const rules = {
    '.modern-menu': {
      position: 'fixed',
      top: '1rem',
      padding:'1rem',
      left: '1rem',
      zIndex: '9999',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    '.menu-button': {
      background: '#111827',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s'
    },
    '.menu-button:hover': {
      background: '#111827E6',
      transform: 'scale(1.03)'
    },
    '.menu-container': {
      display: 'none',
      background: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
      marginTop: '0.75rem',
      width: '24rem',
      justifyContent: 'center',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    '.tabs': {
      display: 'flex',
      margin: '0% auto',
      marginTop: '20px',
      border: '5px solid #f9f9f9;',
      background: '#f9f9f9',
      borderRadius: '10px',
      width:'90%',
    },
    '.tab': {
      flex: '1',
      padding: '0.75rem',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      color: '#6b7280',
      transition: 'all 0.2s',
      borderBottom: '2px solid transparent'
    },
    '.tab.active': {
      color: 'black',
      borderBottomColor: '#3b82f6',
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    },
    '.tab:hover': {
      color: '#4b5563',
      transform: 'scale(1.05)'
    },
    '.tab-content': {
      display: 'none',
      padding: '1rem'
    },
    '.tab-content.active': {
      display: 'block',
      overflowY: 'auto',
      maxHeight: '300px'
    },
    '.action-button': {
      width: '91%',
      background: '#111827',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1rem',
      borderRadius: '0.375rem',
      fontWeight: '500',
      cursor: 'pointer',
      marginBottom: '0.5rem',
      transition: 'background 0.2s'
    },
    '.action-button:hover': {
      background: '#111827E6',
      transform: 'scale(1.03)'
    },
    '.chat-container': {
      maxHeight: '15rem',
      overflowY: 'auto',
      marginBottom: '1rem'
    },
    '.chat-message': {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      marginBottom: '0.5rem'
    },
    '.user-message': {
      background: '#111827',
      color: 'white',
      marginLeft: '2rem'
    },
    '.assistant-message': {
      background: '#f3f4f6',
      marginRight: '2rem'
    },
    '.input-container': {
      display: 'flex',
      gap: '0.5rem'
    },
    '.chat-input': {
      flex: '1',
      padding: '0.75rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.375rem',
      fontSize: '0.875rem'
    },
    '.chat-input:focus': {
      outline: '2px solid #3b82f6',
      borderColor: 'transparent'
    }
  };

  let styleString = '';
  for (const [selector, properties] of Object.entries(rules)) {
    styleString += `${selector} {`;
    for (const [property, value] of Object.entries(properties)) {
      styleString += `${property.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`;
    }
    styleString += '}';
  }

  styleSheet.textContent = styleString;
  document.head.appendChild(styleSheet);
}

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

  const tabsData = ['<i class="fa-solid fa-shield-dog"></i> cheats', '<i class="fa-regular fa-message"></i> response', '<i class="fa-solid fa-brain"></i> AI'];
  tabsData.forEach((tabName, index) => {
    const tab = document.createElement('button');
    tab.className = `tab${index === 0 ? ' active' : ''}`;
    tab.setAttribute('data-tab', tabName);
    tab.innerHTML = tabName.charAt(0).toUpperCase() + tabName.slice(1);
    tabsContainer.appendChild(tab);
  });

  menuContainer.appendChild(tabsContainer);

  const createTabContent = (name, isActive = false) => {
    const content = document.createElement('div');
    content.className = `tab-content${isActive ? ' active' : ''}`;
    content.setAttribute('data-content', name);
    return content;
  };

  const cheatsContent = createTabContent('<i class="fa-solid fa-shield-dog"></i> cheats', true);
  const buttons = [
    'reveal-answer(Alt+P)', 
    'show-all-answers', 
    'auto-fill-answer',
    'explanation', 
    'question-info',
    'random-answer', 
    'copy-text(Right-click)',
    'skip-to-next'
  ];
  buttons.forEach(id => {
    const button = document.createElement('button');
    button.className = 'action-button';
    button.style.fontWeight = 'bold';
    button.id = id;
    button.textContent = id.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ').replace(/\(.*?\)/, '').trim() + (id.includes('(') ? ' ' + id.match(/\(.*?\)/)[0] : '');
    cheatsContent.appendChild(button);
  });

  const responseContent = createTabContent('<i class="fa-regular fa-message"></i> response');
  const answersDisplay = document.createElement('div');
  answersDisplay.id = 'answers-display';
  answersDisplay.style.fontWeight = 'bold';
  answersDisplay.style.whiteSpace = "pre-line";
  answersDisplay.textContent = 'Answers shown here...';
  responseContent.appendChild(answersDisplay);

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
  sendButton.style.fontWeight = 'bold';
  sendButton.style.margin = '0';
  sendButton.textContent = 'Send';

  const botAnswer = document.createElement('button');
  botAnswer.className = 'action-button';
  botAnswer.id = 'botAnswer';
  botAnswer.style.width = '91%';
  botAnswer.style.margin = '3% auto';
  botAnswer.style.fontWeight = 'bold';
  botAnswer.textContent = "AI Solve (Not always 100% accurate)";

  inputContainer.appendChild(chatInput);
  inputContainer.appendChild(sendButton);

  aiContent.appendChild(chatContainer);
  aiContent.appendChild(inputContainer);
  aiContent.appendChild(botAnswer);

  menuContainer.appendChild(cheatsContent);
  menuContainer.appendChild(responseContent);
  menuContainer.appendChild(aiContent);

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

createStyles();
const elements = createMenuStructure();
let chatHistory = [];

elements.menuButton.addEventListener('click', () => {
  const isHidden = elements.menuContainer.style.display === 'none' || !elements.menuContainer.style.display;
  elements.menuContainer.style.display = isHidden ? 'flex' : 'none';
  elements.menuButton.textContent = isHidden ? 'Hide Menu' : 'Show Menu';
});

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

// Helper function to check if content has math
function hasMathContent(text) {
  if (!text) return false;
  // Check for MathML
  if (text.includes('<math') || text.includes('</math>')) return true;
  // Check for LaTeX delimiters
  if (text.match(/\\\(|\\\[|\$\$?|\\begin{/)) return true;
  // Check for common math symbols/commands
  if (text.match(/\\frac|\\sqrt|\\sum|\\int|\\lim|\\alpha|\\beta|\\gamma/)) return true;
  return false;
}

// Improved answer extraction function
function getAnswerFromQuestion() {
  try {
    const currentItem = window.LearnosityAssess.getCurrentItem();
    if (!currentItem || !currentItem.questions || !currentItem.questions[0]) {
      return { success: false, message: "No question found" };
    }

    const question = currentItem.questions[0];
    const questionType = question.type;
    
    // Handle different question types
    if (questionType === "mcq" || questionType === "choicematrix") {
      // Multiple choice
      const validResponse = question.validation.valid_response.value;
      let answerText = [];
      
      if (Array.isArray(validResponse)) {
        validResponse.forEach(val => {
          const option = question.options.find(opt => opt.value === val || opt.value === val.value);
          if (option) {
            answerText.push(option.label || option.value);
          }
        });
      } else {
        const option = question.options.find(opt => opt.value === validResponse);
        if (option) {
          answerText.push(option.label || option.value);
        }
      }
      
      return { 
        success: true, 
        answer: answerText.join(", "), 
        type: questionType,
        hasFormat: answerText.some(t => hasMathContent(t))
      };
    } 
    else if (questionType === "clozetext" || questionType === "clozedropdown") {
      // Fill in the blank / dropdown
      const validResponse = question.validation.valid_response.value;
      return { 
        success: true, 
        answer: Array.isArray(validResponse) ? validResponse.join(", ") : validResponse, 
        type: questionType,
        hasFormat: false
      };
    }
    else if (questionType === "association") {
      // Matching
      const validResponse = question.validation.valid_response.value;
      let matches = [];
      validResponse.forEach(match => {
        matches.push(`${match[0]} → ${match[1]}`);
      });
      return { 
        success: true, 
        answer: matches.join("\n"), 
        type: questionType,
        hasFormat: false
      };
    }
    else if (questionType === "orderlist") {
      // Ordering
      const validResponse = question.validation.valid_response.value;
      return { 
        success: true, 
        answer: validResponse.join(" → "), 
        type: questionType,
        hasFormat: false
      };
    }
    else {
      // Generic fallback
      const validResponse = question.validation.valid_response.value;
      return { 
        success: true, 
        answer: JSON.stringify(validResponse), 
        type: questionType,
        hasFormat: false
      };
    }
  } catch (error) {
    console.error("Error getting answer:", error);
    return { success: false, message: error.message };
  }
}

// Show all available answers/options
document.getElementById('show-all-answers').addEventListener('click', () => {
  try {
    const currentItem = window.LearnosityAssess.getCurrentItem();
    const question = currentItem.questions[0];
    let allOptions = [];
    
    if (question.options) {
      question.options.forEach((opt, idx) => {
        allOptions.push(`${idx + 1}. ${opt.label || opt.value}`);
      });
    }
    
    document.querySelector("#answers-display").innerHTML = "All Options:<br><br>" + allOptions.join("<br><br>");
    document.querySelector("body > div.modern-menu > div > div.tabs > button:nth-child(2)").click();
  } catch (error) {
    document.querySelector("#answers-display").textContent = "Error: " + error.message;
  }
});

// Auto-fill the correct answer
document.getElementById('auto-fill-answer').addEventListener('click', () => {
  try {
    const result = getAnswerFromQuestion();
    if (!result.success) {
      alert("Could not auto-fill: " + result.message);
      return;
    }

    const currentItem = window.LearnosityAssess.getCurrentItem();
    const question = currentItem.questions[0];
    const validResponse = question.validation.valid_response.value;

    // Try to select the correct answer based on question type
    if (question.type === "mcq") {
      const radios = document.querySelectorAll('input[type="radio"]');
      const correctValue = Array.isArray(validResponse) ? validResponse[0] : validResponse;
      radios.forEach(radio => {
        if (radio.value === correctValue || radio.value === correctValue.value) {
          radio.click();
        }
      });
    } else if (question.type === "choicematrix") {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      validResponse.forEach(val => {
        checkboxes.forEach(checkbox => {
          if (checkbox.value === val || checkbox.value === val.value) {
            checkbox.click();
          }
        });
      });
    }
    
    alert("Answer auto-filled!");
  } catch (error) {
    alert("Error auto-filling: " + error.message);
  }
});

// Main reveal answer function
document.getElementById('reveal-answer(Alt+P)').addEventListener('click', () => {
  const result = getAnswerFromQuestion();
  const answerElement = document.querySelector("#answers-display");
  
  if (!result.success) {
    answerElement.textContent = "Error: " + result.message;
    document.querySelector("body > div.modern-menu > div > div.tabs > button:nth-child(2)").click();
    return;
  }

  // Only apply MathJax if content actually has math
  if (result.hasFormat) {
    answerElement.innerHTML = `<strong>Answer (${result.type}):</strong><br><br>${result.answer}`;
    
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise([answerElement]).catch(err => console.error("MathJax error:", err));
    }
  } else {
    // Plain text, no formatting needed
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = result.answer;
    answerElement.textContent = `Answer (${result.type}):\n\n${tempDiv.textContent || result.answer}`;
  }
  
  document.querySelector("body > div.modern-menu > div > div.tabs > button:nth-child(2)").click();
});

// Question info
document.getElementById('question-info').addEventListener('click', () => {
  try {
    const currentItem = window.LearnosityAssess.getCurrentItem();
    const question = currentItem.questions[0];
    const info = `
Type: ${question.type}
Points: ${question.metadata?.score_percentage || 'N/A'}
Difficulty: ${question.metadata?.difficulty || 'N/A'}
    `.trim();
    document.querySelector("#answers-display").textContent = info;
    document.querySelector("body > div.modern-menu > div > div.tabs > button:nth-child(2)").click();
  } catch (error) {
    document.querySelector("#answers-display").textContent = "Error: " + error.message;
  }
});

document.getElementById('explanation').addEventListener('click', () => {
  try {
    const currentItem = window.LearnosityAssess.getCurrentItem();
    const explanation = currentItem.questions[0].metadata?.le_incorrect_feedbacks || "No explanation available";
    document.querySelector("#answers-display").innerHTML = explanation;
    document.querySelector("body > div.modern-menu > div > div.tabs > button:nth-child(2)").click();
  } catch (error) {
    document.querySelector("#answers-display").textContent = "Error: " + error.message;
  }
});

document.getElementById('random-answer').addEventListener('click', () => {
  const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
  if (inputs.length > 0) {
    const randomInput = inputs[Math.floor(Math.random() * inputs.length)];
    randomInput.click();
  }
});

document.getElementById('skip-to-next').addEventListener('click', () => {
  const nextButton = document.querySelector("#nextPage > button");
  if (nextButton) nextButton.click();
});

document.getElementById('copy-text(Right-click)').addEventListener('click', () => {
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if (event.target.nodeType === Node.ELEMENT_NODE) {
      const text = event.target.textContent.trim();
      navigator.clipboard.writeText(text).then(() => {
        alert(`Copied: ${text.substring(0, 50)}...`);
      }).catch((error) => {
        alert(`Failed to copy: ${error}`);
      });
    }
  });
});

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") {
    document.querySelector("#prevPage > button")?.click();
  } else if (e.key === "ArrowRight") {
    document.querySelector("#nextPage > button")?.click();
  } else if (e.key === 'p' && e.altKey) {
    e.preventDefault();
    document.getElementById('reveal-answer(Alt+P)').click();
  }
});

// AI functionality
document.getElementById('botAnswer').addEventListener('click', async () => {
  const log = document.querySelector("#answers-display");
  try {
    const elements = document.querySelectorAll(".row");
    let questions_and_options = "";
    elements.forEach(element => {
      const textContent = element.textContent.trim();
      if (textContent) {
        questions_and_options += textContent + "\n";
      }
    });

    if (!questions_and_options.trim()) {
      log.textContent = "No question text found";
      document.querySelector("body > div.modern-menu > div > div.tabs > button:nth-child(2)").click();
      return;
    }

    log.textContent = "AI is thinking...";
    document.querySelector("body > div.modern-menu > div > div.tabs > button:nth-child(2)").click();

    const response = await fetch("https://api.ai21.com/studio/v1/chat/completions", {
      headers: {
        "Authorization": "Bearer d098d436-b358-4039-b135-1324a4937d5b",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "jamba-large-1.7",
        "messages": [{
          "content": "Answer these questions:\n" + questions_and_options + "\n answer every question\n",
          "role": "user"
        }],
        "n": 1,
        "max_tokens": 4000,
        "temperature": 1,
        "top_p": 1,
        "stop": []
      }),
      method: "POST"
    });

    const data = await response.json();
    const fetchedText = data.choices[0].message.content;

    function renderKaTeX(text, container) {
      function escapeHTML(unsafe) {
        return unsafe
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }

      let codeBlocks = [];
      text = text.replace(/```(\w*)\n([\s\S]+?)```/g, (match, lang, content) => {
        const escapedContent = escapeHTML(content.trim());
        const blockId = `__CODE_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push({
          lang: lang || 'plain',
          content: escapedContent
        });
        return blockId;
      });

      text = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, group) =>
        `<div style="text-align:center;">${katex.renderToString(group, { displayMode: true, throwOnError: false })}</div>`
      );

      text = text.replace(/\$([^\$]+?)\$/g, (match, group) =>
        katex.renderToString(group, { throwOnError: false })
      );

      text = text
        .replace(/^(#{1,6})\s*(.+)$/gm, (match, hashes, content) => {
          const level = hashes.length;
          return `<h${level}>${escapeHTML(content.trim())}</h${level}>`;
        })
        .replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/^(---|\*\*\*|___)$/gm, '<hr>')
        .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>')
        .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>')
        .replace(/(\*\*\*|___)(.*?)\1/g, '<strong><em>$2</em></strong>')
        .replace(/~~(.*?)~~/g, '<del>$1</del>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1">')
        .replace(/^(\*|\+|-)\s+(.+)$/gm, '<ul><li>$2</li></ul>')
        .replace(/^(\d+)\.\s+(.+)$/gm, '<ol><li>$2</li></ol>')
        .replace(/(\w+)~(\w+)~/g, '$1<sub>$2</sub>')
        .replace(/(\w+)\^(\w+)\^/g, '$1<sup>$2</sup>');

      codeBlocks.forEach((block, index) => {
        const blockId = `__CODE_BLOCK_${index}__`;
        const codeClass = block.lang ? `language-${block.lang}` : '';
        text = text.replace(blockId,
          `<pre><code class="${codeClass}">${block.content}</code></pre>`
        );
      });

      container.innerHTML = text;
    }

    const outputContainer = document.getElementById('answers-display');
    renderKaTeX(fetchedText, outputContainer);
    document.querySelector("body > div.modern-menu > div > div.tabs > button:nth-child(2)").click();
  } catch (error) {
    console.error("AI Error:", error);
    log.textContent = "Error: " + error.message;
    document.querySelector("body > div.modern-menu > div > div.tabs > button:nth-child(2)").click();
  }
});

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
  } catch (error) {
    console.error('Error:', error);
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
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Load MathJax if needed
let mathJaxConfig = document.createElement('script');
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
    },
    startup: {
      pageReady() {
        return MathJax.startup.defaultPageReady();
      }
    }
  };
`;
document.head.appendChild(mathJaxConfig);

let mathJaxScript = document.createElement('script');
mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
mathJaxScript.async = true;
document.head.appendChild(mathJaxScript);

}

// Connexus iframe button
if (window.location.href.includes('www.connexus.com')) {
  setInterval(() => {
    const iframe = document.getElementById("lessonContentIFrame");
    if (iframe && !iframe.dataset.buttonAdded) {
      let btn = document.createElement("button");
      btn.textContent = "🤫";
      btn.style.position = "absolute";
      btn.style.top = (iframe.getBoundingClientRect().top + 10) + "px";
      btn.style.right = (iframe.getBoundingClientRect().left - 97) + "px";
      btn.style.zIndex = "9999";
      btn.style.background = "#722362";
      btn.style.borderLeft = "2px solid #D2DB0E";
      btn.style.borderRight = "none";
      btn.style.borderTop = "2px solid #D2DB0E";
      btn.style.borderBottom = "2px solid #D2DB0E";
      btn.style.borderRadius = "20px 0 0 20px";
      btn.style.padding = "10px";
      btn.style.fontWeight = "bold";
      btn.style.color = "white";
      btn.style.cursor = "pointer";
      btn.onclick = () => window.open(iframe.src, "_blank");

document.body.appendChild(btn);

      iframe.dataset.buttonAdded = "true";
    }
  }, 0);
}
