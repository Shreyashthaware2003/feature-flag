import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import * as nodemailer from 'nodemailer';
import { join } from 'path';

type SendMailOptions = {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    from?: string;
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
};

@Injectable()
export class MailService {
    private readonly transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_HOST'),
            port: Number(this.configService.get<string>('SMTP_PORT') ?? 587),
            secure: false,
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASS'),
            },
        });
    }

    async renderTemplate(templateName: string, vars: Record<string, string>) {
        const filePath = join(process.cwd(), 'public', 'templates', templateName);
        let html = await readFile(filePath, 'utf-8');

        for (const [key, value] of Object.entries(vars)) {
            html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
        return html;
    }

    async sendMail(options: SendMailOptions) {
        const smtpUser = this.configService.get<string>('SMTP_USER');
        const defaultFrom = `"Feature Flag App" <${smtpUser}>`;

        return this.transporter.sendMail({
            from: options.from ?? defaultFrom,
            to: options.to,
            cc: options.cc,
            bcc: options.bcc,
            replyTo: options.replyTo,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
    }
}
