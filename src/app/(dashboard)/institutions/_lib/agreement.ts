// I've decided to not write reconfirmation (which is only for GB banks only) and allowed_scope - I always want the full scope
type Agreement = {
  id: string;
  userId: string;
  institutionId: string;
  maxHistoricalDays: number;
  validFor: number;
  created: Date;
  accepted: Date;
};
