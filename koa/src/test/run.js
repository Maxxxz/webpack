function tail(i) {
  if (i > 3) return;
  console.log(`修改前 ${i}`);
  tail(i + 1);
  console.log(`修改后 ${i}`);
}

tail(0)
