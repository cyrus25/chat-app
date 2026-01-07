export type ChatItemType = {
  _id: string;
  text: string;
  createdAt: number;
  type: string;
  feedbackType?: string;
  hasFeedback?: boolean;
  replyTo?: string;
  user: {
    _id: string;
    name: string;
  };
  emoji?: string;
};
