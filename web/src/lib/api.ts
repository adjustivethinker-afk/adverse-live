export type Gender = 'male' | 'female';

export type AppUser = {
  id: string;
  email: string;
  fullName: string;
  displayName: string;
  username: string;
  phone: string;
  city: string;
  gender: Gender;
  level: number;
  xp: number;
  streak: number;
  balance: number;
  totalEarned: number;
  pending: number;
  referralCode: string;
  referredBy?: string | null;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isAdmin: boolean;
  joinedAt: string;
  lastActiveAt?: string | null;
  avatarUrl?: string | null;
  status?: 'PENDING_PROFILE' | 'ACTIVE' | 'SUSPENDED';
};

export type SignupInput = {
  fullName: string;
  email: string;
  password: string;
};

export type ProfileInput = {
  username: string;
  fullName: string;
  gender: Gender;
  city: string;
  phone: string;
  referralCode?: string;
};

export type QuizQuestion = {
  id: string;
  category: 'ISLAMIC' | 'PAKISTAN' | 'GENERAL' | 'ADAB';
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type QuizAttempt = {
  id: string;
  uid: string;
  date: string;
  questionId: string;
  picked: number;
  correct: boolean;
  reward: number;
  at: number;
  question: string;
  category: string;
  options: string[];
};

export type QuizSubmitResult = {
  correct: boolean;
  reward: number;
  correctIndex: number;
  newBalance: number;
};

export type WalletTotals = {
  balance: number;
  pending: number;
  totalEarned: number;
};

async function fetchJson<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...opts,
  });
  const json = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((json as any)?.error || response.statusText || 'API error');
  }
  return json as T;
}

function apiPath(path: string) {
  const base = (process.env.NEXT_PUBLIC_API_BASE || "/backend/api").replace(/\/+$/, "");
  return `${base}/${path}`.replace(/([^:]\/)\//g, "$1");
}

export async function signup(data: SignupInput): Promise<void> {
  const res = await fetchJson<{ ok: boolean; error?: string; needsProfile?: boolean }>(
    apiPath('signup.php'),
    { method: 'POST', body: JSON.stringify(data) },
  );
  if (!res.ok) throw new Error(res.error || 'Signup failed');
}

export async function loginEmail(
  email: string,
  password: string,
): Promise<{ kind: 'existing'; user: AppUser } | { kind: 'new' }> {
  const res = await fetchJson<{ ok: boolean; kind: 'existing' | 'new'; user?: AppUser; error?: string }>(
    apiPath('login.php'),
    { method: 'POST', body: JSON.stringify({ email, password }) },
  );
  if (!res.ok) throw new Error(res.error || 'Login failed');
  if (res.kind === 'existing' && res.user) {
    return { kind: 'existing', user: res.user };
  }
  return { kind: 'new' };
}

export async function signInWithGoogle(): Promise<{ kind: 'existing'; user: AppUser } | { kind: 'new' }> {
  throw new Error('Google sign-in is not yet supported in the migrated backend.');
}

export async function consumeRedirectResult(): Promise<null> {
  return null;
}

export async function refreshCurrentUser(): Promise<AppUser | null> {
  try {
    const res = await fetchJson<{ ok: boolean; user: AppUser }>(apiPath('me.php'));
    return res.user;
  } catch {
    return null;
  }
}

export async function completeProfile(data: ProfileInput): Promise<AppUser> {
  const res = await fetchJson<{ ok: boolean; user: AppUser; error?: string }>(
    apiPath('complete-profile.php'),
    { method: 'POST', body: JSON.stringify(data) },
  );
  if (!res.ok) throw new Error(res.error || 'Complete profile failed');
  return res.user;
}

export async function updateMyProfile(patch: {
  fullName?: string;
  city?: string;
  avatarUrl?: string | null;
}): Promise<void> {
  const res = await fetchJson<{ ok: boolean; error?: string }>(
    apiPath('profile.php'),
    { method: 'POST', body: JSON.stringify(patch) },
  );
  if (!res.ok) throw new Error(res.error || 'Update profile failed');
}

export async function logout(): Promise<void> {
  await fetchJson<{ ok: boolean }>(apiPath('logout.php'), { method: 'POST' });
}

export async function fetchUserById(uid: string): Promise<AppUser | null> {
  const res = await fetchJson<{ ok: boolean; user: AppUser }>(
    apiPath(`user.php?id=${encodeURIComponent(uid)}`),
  );
  return res.user || null;
}

export async function fetchUserByUsername(username: string): Promise<AppUser | null> {
  const res = await fetchJson<{ ok: boolean; user: AppUser }>(
    apiPath(`user.php?username=${encodeURIComponent(username)}`),
  );
  return res.user || null;
}

export async function isProfileIncomplete(): Promise<boolean> {
  const res = await fetchJson<{ ok: boolean; user: AppUser }>(apiPath('me.php'));
  return res.user?.status === 'PENDING_PROFILE';
}

export async function touchHeartbeat(): Promise<void> {
  await fetchJson<{ ok: boolean }>(apiPath('heartbeat.php'), { method: 'POST' });
}

export async function fetchFriends(maxItems = 60): Promise<AppUser[]> {
  const res = await fetchJson<{ ok: boolean; users: AppUser[] }>(
    apiPath(`friends.php?maxItems=${encodeURIComponent(String(maxItems))}`),
  );
  return res.users;
}

export async function fetchTodaysQuiz(): Promise<{
  attempted: boolean;
  question: QuizQuestion;
  attempt?: QuizAttempt;
}> {
  const res = await fetchJson<{
    ok: boolean;
    attempted: boolean;
    question: QuizQuestion;
    attempt?: QuizAttempt;
  }>(apiPath('quiz.php'));
  return res;
}

export async function submitQuizAnswer(
  questionId: string,
  pickedIndex: number,
): Promise<QuizSubmitResult> {
  const res = await fetchJson<{
    ok: boolean;
    correct: boolean;
    reward: number;
    correctIndex: number;
    newBalance: number;
  }>(
    apiPath('quiz-submit.php'),
    { method: 'POST', body: JSON.stringify({ questionId, pickedIndex }) },
  );
  return {
    correct: res.correct,
    reward: res.reward,
    correctIndex: res.correctIndex,
    newBalance: res.newBalance,
  };
}

export async function fetchQuizHistory(maxItems = 14): Promise<QuizAttempt[]> {
  const res = await fetchJson<{ ok: boolean; attempts: QuizAttempt[] }>(
    apiPath(`quiz-history.php?maxItems=${encodeURIComponent(String(maxItems))}`),
  );
  return res.attempts;
}

export async function fetchWallet(): Promise<{ totals: WalletTotals; transactions: any[] }> {
  const res = await fetchJson<{ ok: boolean; totals: WalletTotals; transactions: any[] }>(apiPath('finance.php'));
  return { totals: res.totals, transactions: res.transactions };
}

export async function fetchTasks(maxItems = 10): Promise<any[]> {
  const res = await fetchJson<{ ok: boolean; tasks: any[] }>(apiPath(`grab_task.php?maxItems=${encodeURIComponent(String(maxItems))}`));
  return res.tasks;
}

export async function grabTask(taskId: string): Promise<any> {
  const res = await fetchJson<{ ok: boolean; task: any }>(
    apiPath('grab_task.php'),
    { method: 'POST', body: JSON.stringify({ taskId }) },
  );
  return res.task;
}
