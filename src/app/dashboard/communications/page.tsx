"use client"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { communications, properties, users as allUsers } from "@/lib/data"
import { useUser } from "@/contexts/user-context"
import { cn } from "@/lib/utils"

export default function CommunicationsPage() {
    const { user } = useUser()
    const activeChat = communications[0];
    const propertyName = properties.find(p => p.id === activeChat.propertyId)?.name;
    const recipient = allUsers.find(u => u.id === activeChat.users.find(id => id !== user.id));

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
        <div>
            <h1 className="text-3xl font-bold font-headline">Communications</h1>
            <p className="text-muted-foreground">Centralized messaging for all your properties.</p>
        </div>
        <Card className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            <div className="col-span-1 border-r">
                 <ScrollArea className="h-full">
                    <div className="p-2">
                        {communications.map(comm => {
                            const property = properties.find(p => p.id === comm.propertyId);
                            const lastMessage = comm.messages[comm.messages.length - 1];
                            return (
                                <div key={comm.id} className="p-3 rounded-lg hover:bg-accent cursor-pointer bg-accent">
                                    <h4 className="font-semibold">{property?.name}</h4>
                                    <p className="text-sm text-muted-foreground truncate">{lastMessage.text}</p>
                                </div>
                            )
                        })}
                    </div>
                 </ScrollArea>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col">
                <div className="p-4 border-b flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={recipient?.avatar} alt={recipient?.name} />
                        <AvatarFallback>{recipient?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">{recipient?.name}</h3>
                        <p className="text-sm text-muted-foreground">{propertyName}</p>
                    </div>
                </div>
                 <ScrollArea className="flex-1 p-4">
                    <div className="flex flex-col gap-4">
                        {activeChat.messages.map(message => (
                            <div key={message.id} className={cn("flex items-end gap-2", message.userId === user.id ? "justify-end" : "justify-start")}>
                                {message.userId !== user.id && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={allUsers.find(u => u.id === message.userId)?.avatar} />
                                        <AvatarFallback>{allUsers.find(u => u.id === message.userId)?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("max-w-xs md:max-w-md p-3 rounded-lg", message.userId === user.id ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                                    <p className="text-sm">{message.text}</p>
                                </div>
                                {message.userId === user.id && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                    </div>
                 </ScrollArea>
                 <div className="p-4 border-t">
                    <div className="relative">
                        <Input placeholder="Type a message..." className="pr-12" />
                        <Button size="icon" className="absolute top-1/2 right-1.5 transform -translate-y-1/2 h-7 w-7">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                 </div>
            </div>
        </Card>
    </div>
  )
}
