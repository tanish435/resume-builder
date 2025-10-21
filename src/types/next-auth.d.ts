import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    username?: string | null;
    isVerified?: boolean;
    initials?: string | null;
    sub?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      username?: string | null;
      isVerified?: boolean;
      initials?: string | null;
      sub?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    email?: string;
    name?: string | null;
    image?: string | null;
    username?: string | null;
    isVerified?: boolean;
    initials?: string | null;
    sub?: string;
  }
}
