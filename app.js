// KCSpeedShop HiPerformance A.I Application
document.addEventListener('DOMContentLoaded', () => {
    // Application data
    const appData = {
        vehicleData: {
            make: "Toyota",
            model: "Supra",
            year: 2023,
            engine: "3.0L Turbo I6",
            vin: "JT164WBXXXXX123456",
            odometer: 15420,
            fuelType: "Petrol",
            healthScore: 92,
            lastWoF: "2024-12-15",
            nextWoF: "2025-12-15",
            emissionStandard: "Euro 6d"
        },
        liveData: {
            rpm: 2450,
            speed: 65,
            coolantTemp: 88,
            oilPressure: 42,
            fuelLevel: 78,
            batteryVoltage: 12.6,
            intakeTemp: 32,
            throttlePosition: 15,
            fuelTrim: 2.3,
            o2Sensor: 0.45
        },
        diagnosticCodes: [
            {
                code: "P0301",
                description: "Cylinder 1 Misfire Detected",
                severity: "Medium",
                aiRecommendation: "Check spark plugs and ignition coils for cylinder 1. This could indicate worn spark plugs or faulty ignition components."
            },
            {
                code: "P0420",
                description: "Catalyst System Efficiency Below Threshold",
                severity: "Low",
                aiRecommendation: "Catalytic converter efficiency is slightly reduced. Monitor for now, but may need replacement if emissions testing fails."
            }
        ],
        aiInsights: [
            "Your vehicle is performing well with a health score of 92/100",
            "Consider replacing spark plugs in the next 5,000km based on current misfire patterns",
            "Fuel efficiency can be improved by 12% with ECO mode tuning",
            "Your driving style suggests Sport mode would provide optimal performance balance",
            "Next WoF due in 6 months - all systems currently compliant"
        ]
    };

    // Initialize variables
    let currentSection = 'dashboard';
    let scanInProgress = false;
    let sessionTimer = null;
    let sessionStartTime = null;
    let liveDataInterval = null;

    // --- NAVIGATION ---
    function setupNavigation() {
        // Bottom navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const section = this.getAttribute('data-section');
                navigateToSection(section);
            });
        });

        // Quick access cards
        const quickAccessCards = document.querySelectorAll('.quick-access-card');
        quickAccessCards.forEach(card => {
            card.addEventListener('click', function() {
                const section = this.getAttribute('data-section');
                navigateToSection(section);
            });
        });
    }

    function navigateToSection(sectionName) {
        // Hide all sections
        const allSections = document.querySelectorAll('.section, .dashboard-section');
        allSections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        const activeNavItem = document.querySelector(`.nav-item[data-section="${sectionName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        currentSection = sectionName;
        
        console.log(`Navigated to section: ${sectionName}`);
    }

    // --- HEALTH SCORE ANIMATION ---
    function animateHealthScore() {
        const healthScore = appData.vehicleData.healthScore;
        const scoreCircle = document.getElementById('healthScoreCircle');
        const scoreNumber = document.getElementById('healthScoreNumber');
        
        if (scoreCircle && scoreNumber) {
            const circumference = 2 * Math.PI * 50; // radius = 50
            const offset = circumference - (healthScore / 100) * circumference;
            
            setTimeout(() => {
                scoreCircle.style.strokeDasharray = circumference;
                scoreCircle.style.strokeDashoffset = offset;
                animateNumber(scoreNumber, 0, healthScore, 2000);
            }, 500);
        }
    }

    function animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.round(start + (end - start) * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // --- LIVE DATA UPDATES ---
    function startLiveDataUpdates() {
        // Initial update
        updateLiveDataDisplay();
        
        // Start interval for updates
        liveDataInterval = setInterval(() => {
            updateLiveData();
            updateLiveDataDisplay();
        }, 2000);
    }

    function updateLiveData() {
        // Simulate realistic variations in live data
        const data = appData.liveData;
        
        // RPM variations
        data.rpm = Math.max(800, data.rpm + (Math.random() - 0.5) * 200);
        
        // Coolant temperature variations
        data.coolantTemp = Math.max(70, Math.min(100, data.coolantTemp + (Math.random() - 0.5) * 2));
        
        // Oil pressure variations
        data.oilPressure = Math.max(30, Math.min(60, data.oilPressure + (Math.random() - 0.5) * 3));
        
        // Fuel level (slowly decreasing)
        if (Math.random() < 0.1) {
            data.fuelLevel = Math.max(0, data.fuelLevel - 0.1);
        }
    }

    function updateLiveDataDisplay() {
        const data = appData.liveData;
        
        const rpmElement = document.getElementById('rpm');
        const coolantTempElement = document.getElementById('coolantTemp');
        const oilPressureElement = document.getElementById('oilPressure');
        const fuelLevelElement = document.getElementById('fuelLevel');

        if (rpmElement) rpmElement.textContent = Math.round(data.rpm).toLocaleString();
        if (coolantTempElement) coolantTempElement.textContent = `${Math.round(data.coolantTemp)}°C`;
        if (oilPressureElement) oilPressureElement.textContent = `${Math.round(data.oilPressure)} PSI`;
        if (fuelLevelElement) fuelLevelElement.textContent = `${Math.round(data.fuelLevel)}%`;
    }

    // --- AI INSIGHTS ---
    function loadAIInsights() {
        const insightsList = document.getElementById('aiInsightsList');
        if (insightsList) {
            insightsList.innerHTML = '';
            
            appData.aiInsights.forEach((insight, index) => {
                setTimeout(() => {
                    const insightElement = document.createElement('div');
                    insightElement.className = 'insight-item';
                    insightElement.innerHTML = `
                        <span class="insight-icon">💡</span>
                        <span class="insight-text">${insight}</span>
                    `;
                    insightsList.appendChild(insightElement);
                }, index * 500);
            });
        }
    }

    // --- DIAGNOSTIC SCAN ---
    function setupDiagnosticScan() {
        const runScanBtn = document.getElementById('runScanBtn');
        if (runScanBtn) {
            runScanBtn.addEventListener('click', runDiagnosticScan);
        }
    }

    function runDiagnosticScan() {
        if (scanInProgress) return;
        
        scanInProgress = true;
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const runScanBtn = document.getElementById('runScanBtn');
        
        if (runScanBtn) {
            runScanBtn.disabled = true;
            runScanBtn.textContent = 'Scanning...';
        }
        
        const scanSteps = [
            'Connecting to ECU...',
            'Reading system parameters...',
            'Analyzing engine data...',
            'Checking emissions system...',
            'Running AI diagnostics...',
            'Generating recommendations...',
            'Scan complete!'
        ];
        
        let currentStep = 0;
        const stepInterval = setInterval(() => {
            if (currentStep < scanSteps.length) {
                const progress = ((currentStep + 1) / scanSteps.length) * 100;
                
                if (progressFill) progressFill.style.width = `${progress}%`;
                if (progressText) progressText.textContent = scanSteps[currentStep];
                
                currentStep++;
            } else {
                clearInterval(stepInterval);
                scanInProgress = false;
                
                if (runScanBtn) {
                    runScanBtn.disabled = false;
                    runScanBtn.textContent = 'Run Full Diagnostic Scan';
                }
                
                if (progressText) progressText.textContent = 'Scan completed successfully';
                
                // Reset progress after 3 seconds
                setTimeout(() => {
                    if (progressFill) progressFill.style.width = '0%';
                    if (progressText) progressText.textContent = 'Ready to scan...';
                }, 3000);
            }
        }, 800);
    }

    // --- AI CHAT ---
    function setupChat() {
        const chatInput = document.getElementById('chatInput');
        const sendChatBtn = document.getElementById('sendChatBtn');
        
        if (chatInput && sendChatBtn) {
            sendChatBtn.addEventListener('click', sendChatMessage);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendChatMessage();
                }
            });
        }
    }

    function sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const chatMessages = document.getElementById('chatMessages');
        
        if (!chatInput || !chatMessages || !chatInput.value.trim()) return;
        
        const userMessage = chatInput.value.trim();
        chatInput.value = '';
        
        // Add user message
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'message user-message';
        userMessageElement.innerHTML = `
            <span class="message-sender">You</span>
            <span class="message-text">${userMessage}</span>
        `;
        chatMessages.appendChild(userMessageElement);
        
        // Simulate AI response after delay
        setTimeout(() => {
            const aiResponse = generateAIResponse(userMessage);
            const aiMessageElement = document.createElement('div');
            aiMessageElement.className = 'message ai-message';
            aiMessageElement.innerHTML = `
                <span class="message-sender">AI Assistant</span>
                <span class="message-text">${aiResponse}</span>
            `;
            chatMessages.appendChild(aiMessageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('misfire') || message.includes('p0301')) {
            return "The P0301 code indicates a misfire in cylinder 1. Based on your vehicle's data, I recommend checking the spark plug and ignition coil for cylinder 1. The misfire pattern suggests it's been occurring intermittently. Would you like me to schedule a diagnostic appointment?";
        } else if (message.includes('fuel') || message.includes('economy')) {
            return "Your current fuel economy is 8.9L/100km. I can improve this by 12% by optimizing your ECU mapping for efficiency. The ECO mode tuning profile would be ideal for your driving patterns.";
        } else if (message.includes('performance') || message.includes('power')) {
            return "Your Supra is currently producing 382HP and 499Nm of torque. With our Track Mode tuning, we can increase this to 427HP and 559Nm. However, this will reduce fuel efficiency by about 25%.";
        } else if (message.includes('wof') || message.includes('warrant')) {
            return "Your WoF is current and expires on December 15, 2025. All systems are NZTA compliant. The minor diagnostic codes won't affect your WoF status, but I recommend addressing them before your next inspection.";
        } else {
            return "I'm analyzing your vehicle's data in real-time. Is there a specific system or issue you'd like me to investigate? I can help with diagnostics, performance optimization, maintenance scheduling, or compliance questions.";
        }
    }

    // --- TUNING PROFILES ---
    function setupTuningProfiles() {
        // Tuning profiles selection
        const profileCards = document.querySelectorAll('.profile-card');
        profileCards.forEach(card => {
            card.addEventListener('click', function() {
                profileCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Apply tuning button
        const applyTuningBtn = document.getElementById('applyTuningBtn');
        if (applyTuningBtn) {
            applyTuningBtn.addEventListener('click', applyTuning);
        }
    }

    function applyTuning() {
        const activeProfile = document.querySelector('.profile-card.active');
        if (!activeProfile) return;
        
        const profileName = activeProfile.querySelector('h4').textContent;
        
        // Show confirmation
        alert(`Applying ${profileName} to your vehicle. This will optimize your vehicle's performance accordingly.`);
        
        // Simulate tuning application
        const applyBtn = document.getElementById('applyTuningBtn');
        if (applyBtn) {
            applyBtn.disabled = true;
            applyBtn.textContent = 'Applying Profile...';
            
            setTimeout(() => {
                applyBtn.disabled = false;
                applyBtn.textContent = 'Apply Selected Profile';
                alert(`${profileName} has been successfully applied to your vehicle!`);
            }, 3000);
        }
    }

    // --- WORKSHOP BAY BOOKING ---
    function setupWorkshopBooking() {
        // Bay booking buttons
        document.querySelectorAll('.bay-card .btn').forEach(btn => {
            if (!btn.disabled) {
                btn.addEventListener('click', function() {
                    const bayCard = this.closest('.bay-card');
                    const bayName = bayCard.querySelector('h4').textContent;
                    bookWorkshopBay(bayName);
                });
            }
        });

        // Workshop session timer
        const startSessionBtn = document.getElementById('startSessionBtn');
        if (startSessionBtn) {
            startSessionBtn.addEventListener('click', toggleWorkshopSession);
        }
    }

    function bookWorkshopBay(bayName) {
        alert(`Booking ${bayName} for your session. This will be charged to your blockchain wallet.`);
        
        // Update bay status
        const bayCards = document.querySelectorAll('.bay-card');
        bayCards.forEach(card => {
            const cardTitle = card.querySelector('h4').textContent;
            if (cardTitle === bayName) {
                card.classList.remove('available');
                card.classList.add('unavailable');
                
                const statusElement = card.querySelector('.bay-status');
                const buttonElement = card.querySelector('.btn');
                
                if (statusElement) {
                    statusElement.textContent = 'Booked';
                    statusElement.classList.remove('available');
                    statusElement.classList.add('unavailable');
                }
                
                if (buttonElement) {
                    buttonElement.disabled = true;
                    buttonElement.textContent = 'Booked';
                }
            }
        });
    }

    function toggleWorkshopSession() {
        const startSessionBtn = document.getElementById('startSessionBtn');
        const timerText = document.querySelector('.timer-text');
        
        if (!sessionTimer) {
            // Start session
            sessionStartTime = new Date();
            sessionTimer = setInterval(updateSessionTimer, 1000);
            
            if (startSessionBtn) {
                startSessionBtn.textContent = 'End Session';
                startSessionBtn.classList.remove('btn--outline');
                startSessionBtn.classList.add('btn--primary');
            }
        } else {
            // End session
            clearInterval(sessionTimer);
            sessionTimer = null;
            
            const duration = new Date() - sessionStartTime;
            const minutes = Math.floor(duration / 60000);
            const cost = Math.round((minutes / 60) * 75 * 100) / 100; // $75/hour rate
            
            alert(`Session ended! Duration: ${minutes} minutes. Cost: $${cost} (charged to your wallet)`);
            
            if (startSessionBtn) {
                startSessionBtn.textContent = 'Start Session';
                startSessionBtn.classList.remove('btn--primary');
                startSessionBtn.classList.add('btn--outline');
            }
            
            if (timerText) {
                timerText.textContent = 'No Active Session';
            }
        }
    }

    function updateSessionTimer() {
        const timerText = document.querySelector('.timer-text');
        if (!timerText || !sessionStartTime) return;
        
        const elapsed = new Date() - sessionStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        timerText.textContent = `Session Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // --- CONNECTION STATUS ---
    function setupConnectionStatus() {
        // Simulate connection status changes
        setInterval(() => {
            const connectionStatus = document.getElementById('connectionStatus');
            if (connectionStatus && Math.random() < 0.05) { // 5% chance every interval
                const isConnected = connectionStatus.classList.contains('connected');
                
                if (isConnected) {
                    connectionStatus.classList.remove('connected');
                    connectionStatus.classList.add('disconnected');
                    connectionStatus.querySelector('.status-text').textContent = 'OBD2 Disconnected';
                    connectionStatus.querySelector('.status-dot').style.background = '#ef4444';
                } else {
                    connectionStatus.classList.remove('disconnected');
                    connectionStatus.classList.add('connected');
                    connectionStatus.querySelector('.status-text').textContent = 'OBD2 Connected';
                    connectionStatus.querySelector('.status-dot').style.background = '#10b981';
                }
            }
        }, 10000);
    }

    // Initialize all functionality
    function init() {
        // Set up navigation
        setupNavigation();
        
        // Health score animation
        animateHealthScore();
        
        // Start live data updates
        startLiveDataUpdates();
        
        // Load AI insights
        loadAIInsights();
        
        // Set up diagnostic scan
        setupDiagnosticScan();
        
        // Set up AI chat
        setupChat();
        
        // Set up tuning profiles
        setupTuningProfiles();
        
        // Set up workshop booking
        setupWorkshopBooking();
        
        // Set up connection status simulation
        setupConnectionStatus();
        
        console.log('KCSpeedShop HiPerformance A.I v2.1.0 initialized successfully');
    }

    // Run initialization
    init();
});