interface TelegramWebApps {
  WebApp: {
    ready(): void;
    expand(): void;
    close(): void;
    // Add other WebApp methods you're using
  };
}

declare global {
  interface Window {
    Telegram?: TelegramWebApps;
  }
}
