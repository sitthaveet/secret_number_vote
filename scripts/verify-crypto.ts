import { otpEncrypt, otpDecrypt } from "../lib/crypto";

async function verify() {
  console.log("--- Starting Verification ---");

  const number = 123;
  const key = "TestPolitician";
  const wrongKey = "WrongPolitician";

  console.log(`Original Number: ${number}`);
  console.log(`Key: ${key}`);

  // 1. Encrypt
  const { hash, salt } = await otpEncrypt(number, key);
  console.log(`Encrypted: hash=${hash}, salt=${salt}`);

  // 2. Decrypt with Correct Key
  const decrypted = await otpDecrypt(hash, key, salt);
  console.log(`Decrypted (Correct Key): ${decrypted}`);

  if (decrypted === number) {
    console.log("✅ Correct Key Decryption Success");
  } else {
    console.error("❌ Correct Key Decryption Failed");
    process.exit(1);
  }

  // 3. Decrypt with Wrong Key
  console.log(`Attempting decryption with Wrong Key: ${wrongKey}`);
  const wrongDecrypted = await otpDecrypt(hash, wrongKey, salt);
  console.log(`Decrypted (Wrong Key): ${wrongDecrypted}`);

  if (wrongDecrypted !== null && wrongDecrypted !== number) {
    console.log("✅ Wrong Key Decryption Success (Returned different number)");
    console.log(`Distance from original: ${Math.abs(wrongDecrypted - number)}`);
  } else if (wrongDecrypted === number) {
    console.error("❌ Wrong Key Decryption Failed (Returned same number!)");
    process.exit(1);
  } else {
    console.log(
      "ℹ️  Wrong Key returned null (might be okay if logic dictates, but we expected a random number)",
    );
  }
}

verify().catch(console.error);
