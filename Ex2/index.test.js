const fs = require('fs')
const { convertPasswordsInFile } = require('./index.js')

it("should encrypt paswords in file", async () => {
  await fs.promises.writeFile("out.txt", "")

  await convertPasswordsInFile("password-file.txt", "out.txt")

  const buffer = await fs.promises.readFile("out.txt")

  expect(buffer.toString())
  .toEqual(`32bdf668b2d2e441f1e80cbb7e2378ac709de1cb7a30b957bc9648901696a0e3
ac02c127eed9194fbe6887fd8cf786c21b95fba983037385391be7935daa0342
1f7f1927ca8ab4373aa54e828a9aefd4ef5a8a264f72d95c9726ead51077f7d4
830411a40cd4e288c10381b25f9fb3ffa996eaaa7396f2998079d16f6b9162fd
936a185caaa266bb9cbe981e9e05cb78cd732b0b3280eb944412bb6f8f8f07af`);
})