import { useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useMessages, usePatients } from '@/hooks/useApi';
import { Send, MessageSquare, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Messages() {
  const { user, isAuthenticated } = useAuth();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { patients, isLoading: patientsLoading } = usePatients();
  const { messages, isLoading: messagesLoading, sendMessage } = useMessages(selectedContact || undefined);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isDoctor = user?.role === 'doctor';
  
  // For simplicity, using patients as contacts for doctors
  // In a real app, you'd have separate endpoints for contacts
  const contacts = patients || [];

  const filteredContacts = contacts.filter((c: any) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentContact = contacts.find((c: any) => c.id === selectedContact);

  const conversationMessages = messages.filter(
    (m: any) =>
      (m.senderId === user?.id && m.receiverId === selectedContact) ||
      (m.senderId === selectedContact && m.receiverId === user?.id)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    await sendMessage(selectedContact, newMessage.trim());
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)]">
        <Card className="h-full">
          <div className="flex h-full">
            {/* Contacts Sidebar */}
            <div className="w-80 border-r flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Messages</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <ScrollArea className="flex-1 px-2">
                <div className="space-y-1 pb-4">
                  {patientsLoading ? (
                    [1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                      </div>
                    ))
                  ) : (
                    filteredContacts.map((contact: any) => {
                      const isSelected = selectedContact === contact.id;

                      return (
                        <button
                          key={contact.id}
                          onClick={() => setSelectedContact(contact.id)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors",
                            isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          )}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className={isSelected ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"}>
                              {contact.name?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{contact.name}</p>
                            <p className={cn(
                              "text-xs truncate",
                              isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              {isDoctor ? 'Patient' : 'Doctor'}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {currentContact?.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{currentContact?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {isDoctor ? 'Patient' : 'Doctor'}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    {messagesLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className={cn("flex", i % 2 === 0 ? "justify-end" : "justify-start")}>
                            <Skeleton className="h-12 w-48 rounded-2xl" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {conversationMessages.map((msg: any) => {
                          const isMine = msg.senderId === user?.id;
                          return (
                            <div
                              key={msg.id}
                              className={cn("flex", isMine ? "justify-end" : "justify-start")}
                            >
                              <div
                                className={cn(
                                  "max-w-[70%] rounded-2xl px-4 py-2",
                                  isMine
                                    ? "bg-primary text-primary-foreground rounded-br-sm"
                                    : "bg-muted rounded-bl-sm"
                                )}
                              >
                                <p className="text-sm">{msg.message}</p>
                                <p className={cn(
                                  "text-xs mt-1",
                                  isMine ? "text-primary-foreground/70" : "text-muted-foreground"
                                )}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button variant="hero" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Select a conversation</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a contact to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
