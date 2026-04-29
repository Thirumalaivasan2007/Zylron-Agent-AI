const ChatHistory = require('../models/ChatHistory');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. Initialize official Gemini SDK (ensure key is trimmed)
const apiKey = (process.env.GEMINI_API_KEY || "").trim();
const genAI = new GoogleGenerativeAI(apiKey);

// 2. Simple, clean AI response function using Gemini 2.0 Flash (Verified for this Key)
const generateAIResponse = async (message) => {
    try {
        const systemInstruction = "You are Zylron AI, an ultra-smart, highly advanced, and helpful AI assistant created by Thirumalai. Keep your responses crisp, intelligent, and tailored to the user's context.";
        
        // Using the verified Gemini 2.5 Flash Lite model (Bypasses 429 Quota Limits)
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",
            systemInstruction: systemInstruction 
        });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini 2.0 API Error:", error);
        return "Zylron AI is currently experiencing a connection issue. Please check your API Key and Render logs. (Debug: " + (error.message || "Unknown error") + ")";
    }
};

// @desc    Chat with AI and store history
// @route   POST /api/chat
// @access  Private
const chatWithAI = async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message || !sessionId) {
            return res.status(400).json({ message: 'Message and Session ID are required' });
        }

        // Get AI Response
        const aiResponse = await generateAIResponse(message);

        // Smart Title Generation for new chat
        let chatTitle = "New Chat";
        const messageCount = await ChatHistory.countDocuments({ user: req.user.id, sessionId });
        
        if (messageCount === 0) {
            // Short/casual messages — don't waste an API call
            if (message.trim().length < 10) {
                chatTitle = "Quick Chat";
            } else {
                try {
                    const titleModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                    // Use BOTH message + AI response for better title context
                    const titlePrompt = `Generate a SHORT chat title (2-4 words max) for this conversation. Only output the title, no quotes, no punctuation.\nUser said: "${message}"\nAI replied: "${aiResponse.substring(0, 150)}"`;
                    const titleResult = await titleModel.generateContent(titlePrompt);
                    const raw = titleResult.response.text().trim().replace(/^[\"'*#]+|[\"'*#]+$/g, '');
                    chatTitle = raw.length > 40 ? raw.substring(0, 40) : raw || "New Chat";
                } catch (err) {
                    console.error("Title Generation Error:", err.message);
                    // Fallback: use first 4 words of message
                    chatTitle = message.split(' ').slice(0, 4).join(' ');
                }
            }
        }

        // Save to Database
        const chatHistory = await ChatHistory.create({
            user: req.user.id,
            sessionId,
            title: chatTitle,
            message,
            response: aiResponse
        });

        res.status(200).json(chatHistory);
    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({ message: 'Failed to communicate with AI' });
    }
};

// @desc    Get user's chat sessions
// @route   GET /api/chat/history
// @access  Private
const getHistory = async (req, res) => {
    try {
        const sessions = await ChatHistory.aggregate([
            { $match: { user: req.user._id } },
            { $sort: { createdAt: 1 } },
            {
                $group: {
                    _id: "$sessionId",
                    titleData: { $first: "$title" },
                    firstMessage: { $first: "$message" },
                    createdAt: { $first: "$createdAt" }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        const formattedSessions = sessions.map(s => ({
            sessionId: s._id,
            message: s.titleData && s.titleData !== "New Chat" ? s.titleData : (s.firstMessage ? s.firstMessage.substring(0, 40) + "..." : "New Chat"),
            createdAt: s.createdAt
        }));

        res.status(200).json(formattedSessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a specific chat session completely
// @route   DELETE /api/chat/session/:sessionId
// @access  Private
const deleteSession = async (req, res) => {
    try {
        const targetId = req.params.sessionId;

        let result = await ChatHistory.deleteMany({ user: req.user._id, sessionId: targetId });

        if (result.deletedCount === 0 && targetId.length === 24) {
            result = await ChatHistory.deleteMany({ user: req.user._id, _id: targetId });
        }

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Chat session not found or already deleted' });
        }

        res.status(200).json({ message: 'Chat session deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get messages for a specific session
// @route   GET /api/chat/session/:sessionId
// @access  Private
const getSessionHistory = async (req, res) => {
    try {
        const history = await ChatHistory.find({
            user: req.user._id,
            sessionId: req.params.sessionId
        }).sort({ createdAt: 1 });

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    chatWithAI,
    getHistory,
    getSessionHistory,
    deleteSession
};