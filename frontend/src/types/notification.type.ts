export interface INotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'process';
  message: string;
  createdAt?: number;
}
