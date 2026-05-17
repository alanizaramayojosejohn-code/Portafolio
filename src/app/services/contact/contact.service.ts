import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly firestore = inject(Firestore);

  async sendMessage(data: ContactMessage): Promise<void> {
    const messages = collection(this.firestore, 'contact_messages');
    await addDoc(messages, {
      ...data,
      createdAt: serverTimestamp(),
    });
  }
}
