export interface GoogleIdResponse {
  credential?: string;
}

export interface GoogleIdConfiguration {
  client_id: string;
  auto_select: boolean;
  cancel_on_tap_outside: boolean;
  callback: (response: GoogleIdResponse) => void;
}

interface GoogleId {
  initialize: (config: GoogleIdConfiguration) => void;
  prompt: () => void;
}

interface GoogleAccounts {
  id: GoogleId;
}

export interface Google {
  accounts: GoogleAccounts;
}
