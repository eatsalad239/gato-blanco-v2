import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin' | 'system';
  timestamp: Date;
  isRead?: boolean;
}

interface RealTimeChatProps {
  currentLanguage: any;
  isGringo: boolean;
}

const mockResponses = {
  en: {
    greeting: "Hello! Welcome to Gato Blanco. How can I help you today?",
    menu: "Our menu features authentic Colombian coffee, traditional cuisine, and premium cocktails. What interests you?",
    services: "We offer Gringo Connection services including coworking, salsa classes, and city tours. Would you like more details?",
    hours: "We're open daily from 7 AM to 2 AM in Zona Rosa, Medellín.",
    location: "Find us at Calle 10 #42-25, Zona Rosa, Medellín, Colombia.",
    reservation: "I'd be happy to help you make a reservation. What service are you interested in?",
    default: "Thank you for your message! Our team will get back to you shortly."
  },
  es: {
    greeting: "¡Hola! Bienvenido a Gato Blanco. ¿Cómo puedo ayudarte hoy?",
    menu: "Nuestro menú incluye café colombiano auténtico, cocina tradicional y cócteles premium. ¿Qué te interesa?",
    services: "Ofrecemos servicios de Conexión Gringo incluyendo coworking, clases de salsa y tours por la ciudad. ¿Quieres más detalles?",
    hours: "Estamos abiertos diariamente de 7 AM a 2 AM en Zona Rosa, Medellín.",
    location: "Encuéntranos en Calle 10 #42-25, Zona Rosa, Medellín, Colombia.",
    reservation: "Me encantaría ayudarte a hacer una reservación. ¿Qué servicio te interesa?",
    default: "¡Gracias por tu mensaje! Nuestro equipo te responderá pronto."
  }
};

export const RealTimeChat: React.FC<RealTimeChatProps> = ({ currentLanguage, isGringo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: mockResponses[currentLanguage?.code === 'es' ? 'es' : 'en'].greeting,
      sender: 'admin',
      timestamp: new Date(),
      isRead: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const responses = mockResponses[currentLanguage?.code === 'es' ? 'es' : 'en'];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getAutoResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('menu') || lowerMessage.includes('food') || lowerMessage.includes('drink') || lowerMessage.includes('coffee')) {
      return responses.menu;
    }
    if (lowerMessage.includes('service') || lowerMessage.includes('gringo') || lowerMessage.includes('tour') || lowerMessage.includes('class')) {
      return responses.services;
    }
    if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('time') || lowerMessage.includes('horario') || lowerMessage.includes('abierto')) {
      return responses.hours;
    }
    if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where') || lowerMessage.includes('dirección') || lowerMessage.includes('dónde')) {
      return responses.location;
    }
    if (lowerMessage.includes('reservation') || lowerMessage.includes('book') || lowerMessage.includes('reserve') || lowerMessage.includes('reservación')) {
      return responses.reservation;
    }

    return responses.default;
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate typing delay
    setTimeout(() => {
      const autoResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoResponse(newMessage),
        sender: 'admin',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, autoResponse]);
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg relative"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-5 h-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Card className="w-80 h-96 bg-slate-900 border-slate-700 shadow-2xl">
        {/* Header */}
        <CardHeader className="pb-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm">
                  GB
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm text-white">
                  Gato Blanco Support
                </CardTitle>
                <p className="text-xs text-green-400">
                  {isGringo ? 'Online' : 'En línea'}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimize}
                className="h-6 w-6 p-0 text-slate-400 hover:text-white"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="h-6 w-6 p-0 text-slate-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col h-80"
            >
              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-48 px-3 py-2 rounded-lg text-sm ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                              : message.sender === 'admin'
                              ? 'bg-slate-700 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {message.text}
                          <div className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-yellow-100' : 'text-slate-400'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Input */}
              <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isGringo ? "Type your message..." : "Escribe tu mensaje..."}
                    className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};