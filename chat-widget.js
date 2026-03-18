/**
 * Global Chatbox Widget
 * Dynamically injects a premium chat interface into the page.
 */

(function() {
    // 1. Create the HTML structure
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    let welcomeMessage = 'Xin chào! Tôi là trợ lý ảo của Travel Planner. Tôi có thể giúp gì cho chuyến đi của bạn?';
    
    if (currentPage === 'login.html') {
        welcomeMessage = 'Chào mừng bạn quay lại! Bạn cần hỗ trợ gì với việc đăng nhập không?';
    } else if (currentPage === 'register.html') {
        welcomeMessage = 'Rất vui được gặp bạn! Tôi có thể giúp gì cho bạn trong việc tạo tài khoản mới?';
    }

    const chatHTML = `
        <!-- Chat Toggle Button -->
        <div id="chat-widget-toggle" class="chat-toggle">
            <i class="ph-fill ph-chat-circle-dots"></i>
            <span class="chat-badge">1</span>
        </div>

        <!-- Chat Window -->
        <div id="chat-widget-window" class="chat-window hidden">
            <div class="chat-header">
                <div class="chat-user-info">
                    <div class="chat-avatar">
                        <img src="https://ui-avatars.com/api/?name=AI+Assistant&background=00ffff&color=0f172a" alt="AI Avatar">
                        <span class="status-indicator"></span>
                    </div>
                    <div>
                        <h3>Hỗ trợ thông minh</h3>
                        <p>Trực tuyến</p>
                    </div>
                </div>
                <button id="chat-close" class="chat-close-btn">
                    <i class="ph-bold ph-x"></i>
                </button>
            </div>

            <div id="chat-messages" class="chat-messages">
                <div class="message-group ai">
                    <div class="message-bubble">
                        ${welcomeMessage}
                    </div>
                    <span class="message-time">Vừa xong</span>
                </div>
            </div>

            <div class="chat-footer">
                <div class="chat-input-container">
                    <input type="text" id="chat-input" placeholder="Nhập tin nhắn...">
                    <button id="chat-send">
                        <i class="ph-fill ph-paper-plane-right"></i>
                    </button>
                </div>
                <p class="chat-disclaimer">Powered by AI Travel Assistant</p>
            </div>
        </div>
    `;

    // 2. Append to body
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-widget-container';
    chatContainer.innerHTML = chatHTML;
    document.body.appendChild(chatContainer);

    // 3. Logic
    const toggle = document.getElementById('chat-widget-toggle');
    const windowEl = document.getElementById('chat-widget-window');
    const closeBtn = document.getElementById('chat-close');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const messages = document.getElementById('chat-messages');

    // Toggle open/close
    toggle.addEventListener('click', () => {
        windowEl.classList.toggle('hidden');
        if (!windowEl.classList.contains('hidden')) {
            const badge = toggle.querySelector('.chat-badge');
            if (badge) badge.style.display = 'none';
            input.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        windowEl.classList.add('hidden');
    });

    // Send message logic
    const sendMessage = () => {
        const text = input.value.trim();
        if (!text) return;

        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'message-group user';
        userMsg.innerHTML = `
            <div class="message-bubble">${text}</div>
            <span class="message-time">Vừa xong</span>
        `;
        messages.appendChild(userMsg);
        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        // Mock AI response
        setTimeout(() => {
            let aiResponse = `Đã nhận! Tôi đang tìm hiểu về "${text}" cho bạn...`;
            
            // Simple contextual mock responses
            const lowerText = text.toLowerCase();
            const authContainer = document.getElementById('authContainer');
            const isSignup = authContainer && authContainer.classList.contains('is-signup');

            if (currentPage === 'login.html') {
                if (isSignup) {
                    if (lowerText.includes('email')) {
                        aiResponse = 'Hãy đảm bảo bạn sử dụng một địa chỉ email hợp lệ để chúng tôi có thể gửi mã xác nhận nếu cần.';
                    }
                } else {
                    if (lowerText.includes('mật khẩu')) {
                        aiResponse = 'Nếu bạn quên mật khẩu, hãy nhấn vào liên kết "Quên mật khẩu?" ngay bên dưới ô nhập mật khẩu nhé.';
                    } else if (lowerText.includes('không đăng nhập được')) {
                        aiResponse = 'Bạn vui lòng kiểm tra lại email và mật khẩu. Đảm bảo không có phím Caps Lock nào đang bật.';
                    }
                }
            }

            const aiMsg = document.createElement('div');
            aiMsg.className = 'message-group ai';
            aiMsg.innerHTML = `
                <div class="message-bubble">${aiResponse}</div>
                <span class="message-time">Vừa xong</span>
            `;
            messages.appendChild(aiMsg);
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
    };

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

})();
