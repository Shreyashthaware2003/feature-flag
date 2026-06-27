import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
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
export class MailService implements OnModuleInit {
    private readonly transporter: nodemailer.Transporter;
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly configService: ConfigService) {
        const smtpHost = this.configService.get<string>('SMTP_HOST');
        const smtpPort = Number(this.configService.get<string>('SMTP_PORT') ?? 587);
        const smtpUser = this.configService.get<string>('SMTP_USER');
        const smtpPass = (this.configService.get<string>('SMTP_PASS') ?? '').replace(/\s+/g, '');

        this.transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 20000,
            tls: { minVersion: 'TLSv1.2' },
        });
    }

    async onModuleInit(): Promise<void> {
        try {
            await this.transporter.verify();
            this.logger.log('SMTP transporter is ready.');
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.warn(`SMTP verify failed: ${message}`);
        }
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
