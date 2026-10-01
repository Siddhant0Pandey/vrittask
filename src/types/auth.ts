export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

/** Public, non-sensitive user information exposed to the client. */
export interface SessionUser {
  id: number;
  username: string;
}

export type LoginFormState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof LoginCredentials, string>>;
      values?: Pick<LoginCredentials, "username">;
    };
