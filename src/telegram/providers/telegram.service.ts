import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
// or if using CommonJS style, use:
// import * as axios from 'axios';

@Injectable()
export class TelegramService {
  private messageCount = 0;
  private lastReset = Date.now();
  constructor(private readonly configService: ConfigService) {}
  async sendMessage(message: string) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
    if (!token || !chatId) return;
    try {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: message,
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        console.error('Telegram API error:', error.response?.data);
      } else if (error instanceof Error) {
        console.error('Failed to send log to Telegram:', error.message);
      } else {
        console.error('Failed to send log to Telegram:', error);
      }
    }
  }

  async log(message: string) {
    //const now = Date.now();
    // reset counter every 60s
    // if (now - this.lastReset > 60000) {
    //   this.messageCount = 0;
    //   this.lastReset = now;
    // }
    // if (this.messageCount < 5) {
    //   this.messageCount++;
    //   await this.sendMessage(`ℹ️ LOG: ${message}`);
    // } else if (this.messageCount === 5) {
    //   this.messageCount++;
    //   await this.sendMessage(
    //     '⚠️ Error flood detected. Further messages suppressed for 1 minute.',
    //   );
    // }
    //console.log(message);
  }

  async error(message: string, trace?: string) {
    console.error(message, trace);
    await this.sendMessage(`❌ ERROR: ${message}\nTrace: ${trace ?? ''}`);
  }

  async warn(message: string) {
    console.warn(message);
    await this.sendMessage(`⚠️ WARNING: ${message}`);
  }
}
