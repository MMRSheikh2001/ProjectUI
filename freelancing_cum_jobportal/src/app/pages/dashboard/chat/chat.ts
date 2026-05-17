import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../../shared/sidebar/sidebar';
import { AuthService } from '../../../services/auth';
import { ChatService } from '../../../services/chat';
import { MessageService } from '../../../services/message';
import { OrderService } from '../../../services/order';

import { Message } from '../../../models/message';
import { Order } from '../../../models/order';
import { ChatModel } from '../../../models/chat';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, AfterViewChecked {

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  loading = true;
  chats: ChatModel[] = [];
  selectedChat: ChatModel | null = null;
  messages: Message[] = [];
  orders: Order[] = [];
  newMessage = '';
  sending = false;
  userId: string | number = '';
  shouldScrollToBottom = false;

  constructor(
    private auth: AuthService,
    private chatService: ChatService,
    private messageService: MessageService,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const userId = this.auth.getCurrentUserId();
    if (!userId) {
      this.loading = false;
      return;
    }
    this.userId = userId;
    // Safety timeout — always stop spinner after 3s
    const loadingTimeout = setTimeout(() => { this.loading = false; }, 3000);
    this.loadChatsWithTimeout(loadingTimeout);
  }

  loadChatsWithTimeout(timeoutHandle: any): void {
    this.chatService.findAll().subscribe({
      next: (allChats) => {
        this.orderService.findByClientId(this.userId).subscribe({
          next: (clientOrders) => {
            this.orderService.findByFreelancerId(this.userId).subscribe({
              next: (freelancerOrders) => {
                clearTimeout(timeoutHandle);
                const myOrderIds = new Set([
                  ...clientOrders.map(o => String(o.id)),
                  ...freelancerOrders.map(o => String(o.id))
                ]);
                this.chats = allChats.filter(c => myOrderIds.has(String(c.orderId)));
                this.orders = [...clientOrders, ...freelancerOrders];
                this.loading = false;
                if (this.chats.length > 0) {
                  this.selectChat(this.chats[0]);
                }
                this.cdr.markForCheck();
              },
              error: () => { clearTimeout(timeoutHandle); this.loading = false; }
            });
          },
          error: () => { clearTimeout(timeoutHandle); this.loading = false; }
        });
      },
      error: () => { clearTimeout(timeoutHandle); this.loading = false; }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }



  selectChat(chat: ChatModel): void {
    this.selectedChat = chat;
    this.loadMessages(chat.id!);
  }

  loadMessages(chatId: string | number): void {
    this.messageService.findByChatId(chatId).subscribe({
      next: (msgs) => {
        this.messages = msgs;
        this.shouldScrollToBottom = true;
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedChat?.id || !this.selectedChat.isActive) return;
    this.sending = true;

    const msg: Message = {
      chatId: this.selectedChat.id,
      senderId: this.userId,
      message: this.newMessage.trim(),
      status: 'sent',
      createdAt: new Date().toISOString()
    };

    this.messageService.save(msg).subscribe({
      next: (saved) => {
        this.messages.push(saved);
        this.newMessage = '';
        this.sending = false;
        this.shouldScrollToBottom = true;
      },
      error: () => { this.sending = false; }
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        if (this.messageContainer && this.messageContainer.nativeElement) {
          this.messageContainer.nativeElement.scrollTop =
            this.messageContainer.nativeElement.scrollHeight;
        }
      } catch (err) {
        console.warn('Scroll to bottom failed:', err);
      }
    }, 100);
  }

  isMine(msg: Message): boolean {
    return msg.senderId === this.userId;
  }

  getOrderForChat(chat: ChatModel): Order | undefined {
    return this.orders.find(o => o.id === chat.orderId);
  }

  getChatLabel(chat: ChatModel): string {
    const order = this.getOrderForChat(chat);
    return order ? `Order #${(order.id + '').slice(0, 8)}` : `ChatModel #${(chat.id + '').slice(0, 8)}`;
  }

  getTimeLabel(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-BD', { day: '2-digit', month: 'short' });
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}