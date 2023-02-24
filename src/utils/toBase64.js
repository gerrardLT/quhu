export function getBase64 (imgUrl, callback) {
  let image = new Image();
  // 解决跨域问题
  image.setAttribute("crossOrigin", "anonymous");
  let imageUrl = imgUrl;
  image.src = imageUrl;
  // image.onload为异步加载
  // eslint-disable-next-line no-undef
  image.onload = function () {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext("2d");
    // eslint-disable-next-line no-undef
    context.drawImage(image, 0, 0, image.width, image.height);
    var quality = 0.8;
    // 这里的dataurl就是base64类型
    // 使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
    let dataurl = canvas.toDataURL("image/jpeg", quality);
    callback ? callback(dataurl) : null; //调用回调函数
  };
}

export function toArrayBuffer (buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

const buffer = {}
buffer.concat = function (list, length) {
  if (!Array.isArray(list)) {
    throw new Error('Usage:Buffer.concat(list,[length])');
  }
  //list值不为数组的情况

  if (list.length === 0) {
    return toArrayBuffer(0);
  } else if (list.length === 1) {
    return list[0];
  }
  //length值为0的情况返回一个不包含任何项的buffer实例
  //length值为1的情况下返回一个仅包含list数组第一项的buffer实例

  if (typeof length !== 'number') {
    //对于length不为undefined的情况，即length值没有被写入或者错误写入
    length = 0;
    for (let i = 0; i < list.length; i++) {
      var buf = list[i];
      length += buf.length;
    }
  }

  var buffer = toArrayBuffer(length);
  var pos = 0;
  for (let i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};
export {
  buffer
}