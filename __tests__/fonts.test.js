const fs = require('fs');
const path = require('path');

const fontNames = [
  'PlusJakartaSans-Regular.ttf',
  'PlusJakartaSans-Medium.ttf',
  'PlusJakartaSans-SemiBold.ttf',
  'PlusJakartaSans-Bold.ttf',
  'PlusJakartaSans-ExtraBold.ttf',
  'MaterialSymbolsOutlined.ttf',
  'MaterialSymbolsFilled.ttf',
];

function sfntTables(file) {
  const buf = fs.readFileSync(file);
  const numTables = buf.readUInt16BE(4);
  const tags = [];
  for (let index = 0; index < numTables; index += 1) {
    const offset = 12 + index * 16;
    tags.push(buf.toString('ascii', offset, offset + 4));
  }
  return tags;
}

test('ships static fonts that API 24 can load', () => {
  const sourceDir = path.join(__dirname, '../src/assets/fonts');
  const androidDir = path.join(
    __dirname,
    '../android/app/src/main/assets/fonts',
  );
  const gradle = fs.readFileSync(
    path.join(__dirname, '../android/build.gradle'),
    'utf8',
  );

  expect(gradle).toContain('minSdkVersion = 24');
  fontNames.forEach(name => {
    const source = path.join(sourceDir, name);
    const packaged = path.join(androidDir, name);
    expect(fs.readFileSync(packaged).equals(fs.readFileSync(source))).toBe(
      true,
    );
    const tables = sfntTables(source);
    expect(tables).not.toContain('fvar');
    expect(tables).not.toContain('gvar');
  });
});
