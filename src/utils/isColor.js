function isColor(str) {
  // 十六进制颜色格式
  var hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  
  // RGB颜色格式
  var rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
  
  // RGBA颜色格式
  var rgbaRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d\.]+\s*\)$/;
  
  // 判断字符串是否匹配颜色格式
  return hexRegex.test(str) || rgbRegex.test(str) || rgbaRegex.test(str);
}

module.exports = isColor;