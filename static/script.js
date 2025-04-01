// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Welcome Popup functionality
    const welcomePopup = document.getElementById('welcome-popup');
    const closeWelcomePopup = document.getElementById('close-welcome-popup');
    const welcomeBtn = document.querySelector('.welcome-btn');
    
    // Show popup immediately when page loads
    welcomePopup.style.display = 'flex';
    
    // Close popup when clicking the close button
    closeWelcomePopup.addEventListener('click', function() {
        welcomePopup.style.display = 'none';
    });
    
    // Handle form submission (simulate)
    welcomeBtn.addEventListener('click', function() {
        const nameInput = document.querySelector('.welcome-input:nth-child(1)');
        const phoneInput = document.querySelector('.welcome-input:nth-child(2)');
        
        if (nameInput.value.trim() !== '' && phoneInput.value.trim() !== '') {
            alert('Спасибо за обращение! Наш специалист свяжется с вами в ближайшее время.');
            welcomePopup.style.display = 'none';
        } else {
            alert('Пожалуйста, заполните все поля формы.');
        }
    });
    
    // Also close popup when clicking outside the popup content
    welcomePopup.addEventListener('click', function(e) {
        if (e.target === welcomePopup) {
            welcomePopup.style.display = 'none';
        }
    });

    // Toggle theme button functionality
    const themeButton = document.getElementById('theme-toggle');
    themeButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        console.log('Theme button clicked!');
        
        // Update button text
        if (document.body.classList.contains('dark-theme')) {
            themeButton.textContent = 'Switch to Light Mode';
        } else {
            themeButton.textContent = 'Switch to Dark Mode';
        }
    });

    // Discount Calculator functionality
    const bodiesCountInput = document.getElementById('bodies-count');
    const calculateBtn = document.getElementById('calculate-btn');
    const totalPriceDisplay = document.getElementById('total-price');
    const discountInfoDisplay = document.getElementById('discount-info');
    const expressDelivery = document.getElementById('feature-express');
    const premiumCoffin = document.getElementById('feature-premium');
    const selfDelivery = document.getElementById('feature-self-delivery');
    const cashback = document.getElementById('feature-cashback');
    const photozone = document.getElementById('feature-photozone');
    
    calculateBtn.addEventListener('click', function() {
        // Get the number of bodies
        const bodiesCount = parseInt(bodiesCountInput.value) || 1;
        
        // Base price calculation (10,000 per body)
        let basePrice = 10000 * bodiesCount;
        
        // Additional features
        if (expressDelivery.checked) basePrice += 2000;
        if (premiumCoffin.checked) basePrice += 5000 * bodiesCount; // Premium coffin for each body
        if (photozone.checked) basePrice += 1500;
        
        // Calculate discount based on number of bodies
        let discountPercent = 0;
        if (bodiesCount >= 2 && bodiesCount < 5) {
            discountPercent = 10;
        } else if (bodiesCount >= 5 && bodiesCount < 10) {
            discountPercent = 20;
        } else if (bodiesCount >= 10) {
            discountPercent = 30;
        }
        
        // Apply self-delivery discount (20%)
        if (selfDelivery.checked) {
            discountPercent += 20;
        }
        
        // Apply cashback from funeral reception (up to 15%)
        let cashbackPercent = 0;
        if (cashback.checked) {
            cashbackPercent = 15;
            // Display cashback separately
            discountInfoDisplay.innerHTML = 'Скидка: ' + discountPercent + '% + Кэшбек: ' + cashbackPercent + '%';
        } else {
            discountInfoDisplay.textContent = 'Скидка: ' + discountPercent + '%';
        }
        
        // Apply discount
        const discountAmount = basePrice * (discountPercent / 100);
        let finalPrice = basePrice - discountAmount;
        
        // Apply cashback if selected
        if (cashback.checked) {
            const cashbackAmount = finalPrice * (cashbackPercent / 100);
            discountInfoDisplay.innerHTML += ' (Экономия: ' + (discountAmount + cashbackAmount).toLocaleString() + ' руб.)';
            // We don't subtract the cashback from the final price since it's a "future" benefit
        } else {
            discountInfoDisplay.innerHTML += ' (Экономия: ' + discountAmount.toLocaleString() + ' руб.)';
        }
        
        // Display results
        totalPriceDisplay.textContent = finalPrice.toLocaleString() + ' руб.';
    });
    
    // Big Red Discount Button functionality
    const discountBtn = document.getElementById('discount-btn');
    
    console.log('Discount button element:', discountBtn); // Debug log
    
    discountBtn.addEventListener('click', function() {
        console.log('Discount button clicked!'); // Debug log
        
        // Vibration effect
        this.classList.add('vibrate');
        
        // Create alert or modal
        alert('Поздравляем! Ваш промокод на скидку: VADIM' + Math.floor(Math.random() * 1000));
        
        // Remove vibration class after animation
        setTimeout(() => {
            this.classList.remove('vibrate');
        }, 500);
    });

    // Chat popup functionality
    const chatPopup = document.getElementById('chat-popup');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendMessage = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    
    // Debug logs to check if elements exist
    console.log('Chat button found:', sendMessage);
    console.log('Chat input found:', chatInput);
    
    // Predefined manager responses
    const managerResponses = [
        "Конечно, мы можем помочь с этим. Какие детали вас интересуют?",
        "У нас действует скидка 15% на комплексные услуги. Могу рассказать подробнее.",
        "Мы работаем круглосуточно, можем выехать в любое время.",
        "Да, у нас есть услуга экспресс-доставки. Стоимость 2000 рублей.",
        "Мы гарантируем качество наших услуг. Работаем уже более 10 лет на рынке.",
        "Можете оставить ваш номер телефона? Наш специалист перезвонит вам в ближайшее время.",
        "Спасибо за обращение! Если у вас есть еще вопросы, не стесняйтесь спрашивать."
    ];
    
    // Close chat when clicking the close button
    closeChat.addEventListener('click', function() {
        chatPopup.style.display = 'none';
        
        // Set a timer to reopen the chat after 15 seconds
        setTimeout(function() {
            chatPopup.style.display = 'block';
        }, 10000);
    });
    
    // Function to add a message to the chat
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'manager-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom of chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to get a random manager response
    function getManagerResponse() {
        const randomIndex = Math.floor(Math.random() * managerResponses.length);
        return managerResponses[randomIndex];
    }
    
    // Function to handle sending a message
    function sendChatMessage() {
        // Log that a message is being sent
        console.log('Sending message: ' + chatInput.value.trim());
        const messageText = chatInput.value.trim();
        if (messageText !== '') {
            // Add user message
            addMessage(messageText, true);
            chatInput.value = '';
            
            // Simulate manager typing (delay response by 1-2 seconds)
            setTimeout(function() {
                addMessage(getManagerResponse(), false);
            }, 1000 + Math.random() * 1000);
        }
    }
    
    // Send message when clicking the send button
    sendMessage.addEventListener('click', function(event) {
        console.log('Send button clicked!');
        event.preventDefault(); // Prevent any default behavior
        sendChatMessage();
    });
    
    // Also add a click listener directly to the button element
    if (sendMessage) {
        console.log('Adding direct click handler to send button');
        document.getElementById('send-message').onclick = function() {
            console.log('Send button clicked with direct onclick!');
            sendChatMessage();
            return false; // Prevent default
        };
    }
    
    // Send message when pressing Enter in the input field
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            console.log('Enter key pressed!');
            sendChatMessage();
        }
    });

    // Make sure chat is visible on page load
    chatPopup.style.display = 'block';
}); 
// Countdown Timer (3 hours from page load)
document.addEventListener('DOMContentLoaded', function () {
    const countdownElement = document.getElementById("countdown-timer");
    if (!countdownElement) return;

    // Установим время окончания акции через 3 часа
    const endTime = new Date(Date.now() + 3 * 60 * 60 * 1000);

    function updateCountdown() {
        const now = new Date();
        const diff = endTime - now;

        if (diff <= 0) {
            countdownElement.textContent = "00:00:00";
            return;
        }

        const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
        const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
        const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");

        countdownElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
});
