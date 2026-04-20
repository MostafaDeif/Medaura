const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3001";
const LOGIN_ENDPOINT = `${BACKEND_URL}/api/auth/login`;

function printResult(title, lines = []) {
  console.log(`\n${title}`);
  for (const line of lines) {
    console.log(`- ${line}`);
  }
}

async function runMigrationCheck() {
  const payload = {
    email: "migration-check@medaura.local",
    password: "migration-check",
  };

  let response;
  let bodyText = "";

  try {
    response = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    bodyText = await response.text();
  } catch (error) {
    printResult("MIGRATION CHECK: FAILED", [
      `Cannot reach backend: ${LOGIN_ENDPOINT}`,
      error instanceof Error ? error.message : "Unknown network error",
    ]);
    process.exit(2);
  }

  const normalizedBody = bodyText.toLowerCase();
  const missingUsersTable =
    normalizedBody.includes("invalid object name") ||
    normalizedBody.includes("dbo.users") ||
    (normalizedBody.includes("users") &&
      normalizedBody.includes("does not exist"));

  if (response.status >= 500 && missingUsersTable) {
    printResult("MIGRATION CHECK: FAILED", [
      `Backend returned ${response.status} from ${LOGIN_ENDPOINT}`,
      "Detected missing users table or unapplied database migrations.",
      "Run backend migration/seed, then rerun this check.",
    ]);
    process.exit(1);
  }

  if (response.status >= 500) {
    printResult("MIGRATION CHECK: FAILED", [
      `Backend returned ${response.status} from ${LOGIN_ENDPOINT}`,
      "Server error is unrelated to a clear missing-table signature.",
      "Inspect backend logs for exact root cause.",
    ]);
    process.exit(1);
  }

  printResult("MIGRATION CHECK: PASSED", [
    `Backend responded with HTTP ${response.status}.`,
    "No obvious missing-table migration signature detected.",
  ]);
}

runMigrationCheck();
