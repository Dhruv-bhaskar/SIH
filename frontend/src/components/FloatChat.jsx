import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BarChart3, Globe, Waves, TrendingUp, MapPin, Calendar, Thermometer, Droplets } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter } from 'recharts';

const FloatChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Welcome to FloatChat! I can help you explore ARGO ocean data. Ask me about ocean temperature, salinity, currents, or any marine data insights you need.',
      timestamp: new Date(),
      hasVisualization: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sample data for demonstrations
  const temperatureData = [
    { month: 'Jan', temperature: 24.2, depth: 10 },
    { month: 'Feb', temperature: 25.1, depth: 10 },
    { month: 'Mar', temperature: 26.8, depth: 10 },
    { month: 'Apr', temperature: 28.2, depth: 10 },
    { month: 'May', temperature: 29.5, depth: 10 },
    { month: 'Jun', temperature: 30.1, depth: 10 },
    { month: 'Jul', temperature: 29.8, depth: 10 },
    { month: 'Aug', temperature: 29.2, depth: 10 },
    { month: 'Sep', temperature: 28.5, depth: 10 },
    { month: 'Oct', temperature: 27.1, depth: 10 },
    { month: 'Nov', temperature: 25.8, depth: 10 },
    { month: 'Dec', temperature: 24.9, depth: 10 }
  ];

  const salinityData = [
    { depth: 0, salinity: 35.2 },
    { depth: 50, salinity: 35.4 },
    { depth: 100, salinity: 35.6 },
    { depth: 200, salinity: 35.8 },
    { depth: 500, salinity: 34.9 },
    { depth: 1000, salinity: 34.7 },
    { depth: 1500, salinity: 34.6 },
    { depth: 2000, salinity: 34.7 }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateVisualization = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('temperature') || lowerQuery.includes('temp')) {
      return {
        type: 'temperature',
        title: 'Ocean Temperature Trends',
        data: temperatureData,
        description: 'Sea surface temperature data from ARGO floats showing seasonal variations.'
      };
    } else if (lowerQuery.includes('salinity') || lowerQuery.includes('salt')) {
      return {
        type: 'salinity',
        title: 'Salinity Profile by Depth',
        data: salinityData,
        description: 'Salinity measurements across different ocean depths from ARGO profiles.'
      };
    } else if (lowerQuery.includes('current') || lowerQuery.includes('flow')) {
      return {
        type: 'currents',
        title: 'Ocean Current Analysis',
        data: temperatureData.map(d => ({...d, velocity: Math.random() * 2 + 0.5})),
        description: 'Ocean current velocity data derived from ARGO float trajectories.'
      };
    }
    return null;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      hasVisualization: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const visualization = generateVisualization(inputValue);
      
      let botResponse = "I've analyzed the ARGO ocean data for your query. ";
      
      if (visualization) {
        botResponse += `Here's what I found regarding ${visualization.title.toLowerCase()}. `;
        botResponse += visualization.description;
      } else {
        botResponse += "Could you please specify what ocean parameter you'd like to explore? I can help with temperature, salinity, currents, and more.";
      }

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        hasVisualization: !!visualization,
        visualization: visualization
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuestionClick = (question) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const renderVisualization = (viz) => {
    if (!viz) return null;

    switch (viz.type) {
      case 'temperature':
        return (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Thermometer className="w-4 h-4 mr-2" />
              {viz.title}
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={viz.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="month" stroke="#3730a3" />
                <YAxis stroke="#3730a3" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#f0f4ff', border: '1px solid #3730a3' }}
                  labelStyle={{ color: '#3730a3' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#1d4ed8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'salinity':
        return (
          <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <h4 className="font-semibold text-teal-900 mb-3 flex items-center">
              <Droplets className="w-4 h-4 mr-2" />
              {viz.title}
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={viz.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccfbf1" />
                <XAxis dataKey="depth" stroke="#134e4a" />
                <YAxis stroke="#134e4a" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#f0fdfa', border: '1px solid #134e4a' }}
                  labelStyle={{ color: '#134e4a' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="salinity" 
                  stroke="#0d9488" 
                  fill="#5eead4" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'currents':
        return (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              {viz.title}
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart data={viz.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                <XAxis dataKey="month" stroke="#581c87" />
                <YAxis dataKey="velocity" stroke="#581c87" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#faf5ff', border: '1px solid #581c87' }}
                  labelStyle={{ color: '#581c87' }}
                />
                <Legend />
                <Scatter dataKey="velocity" fill="#7c3aed" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );
      
      default:
        return null;
    }
  };

  const quickQuestions = [
    "Show me temperature trends in the Indian Ocean",
    "What's the salinity profile at different depths?",
    "Analyze ocean currents near the Bay of Bengal",
    "Display seasonal temperature variations"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Waves className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FloatChat</h1>
                <p className="text-sm text-gray-600">AI-Powered ARGO Ocean Data Discovery</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                Global Coverage
              </div>
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                Real-time Data
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with quick actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Questions</h3>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="w-full text-left p-2 text-sm rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Data Sources</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    ARGO Floats: Active
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Vector DB: Online
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    LLM Pipeline: Ready
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(80vh)] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-4 py-3`}>
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0 mt-1">
                          {message.type === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-1">
                            {message.type === 'user' ? 'You' : 'FloatChat AI'}
                          </div>
                          <div className="text-sm leading-relaxed">
                            {message.content}
                          </div>
                          {message.hasVisualization && renderVisualization(message.visualization)}
                        </div>
                      </div>
                      <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <div className="text-sm">FloatChat AI is thinking...</div>
                      </div>
                      <div className="flex space-x-1 mt-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about ocean temperature, salinity, currents, or any marine data..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatChat;