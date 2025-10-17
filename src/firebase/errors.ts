export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public readonly context: SecurityRuleContext;
  constructor(context: SecurityRuleContext) {
    // Construct the error message
    const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules: \n${JSON.stringify(
      context,
      null,
      2
    )}`;

    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;

    // This is to make sure that the error is properly recognized in browsers
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
